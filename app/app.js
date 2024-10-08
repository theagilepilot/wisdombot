import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  verifyKeyMiddleware,
} from 'discord-interactions';
import getGptResponse from './getGptResponse.js';
import { DiscordRequest } from './utils.js';

// Create an express app
const app = express();

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 * Parse request body and verifies incoming requests using discord-interactions package
 */
app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async function (req, res) {
  const { type, data, id, token } = req.body;

  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  if (type === InteractionType.APPLICATION_COMMAND) {
    // Immediate acknowledgment
    res.send({ type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE });

    const { name, options } = data;

    if (name === 'prompt') {
      const messageOption = options?.find(option => option.name === 'message');
      const message = messageOption?.value || '';

      console.log(`Received message: ${message}`);
      console.log(`Generating GPT response...`);

      try {
        const gptResponse = await getGptResponse(message);

        // Format message to fit 2000 character limit
        const trimmedResponse = gptResponse.substring(0, 1800);
        const isResponseTrimmed = gptResponse.length > 1800;

        const trimmedMessage = message.substring(0,100);
        const isMessageTrimmed = message.length > 100;
      
        const formattedMessage = isMessageTrimmed ? trimmedMessage + '...' : message
        const formattedResponse = isResponseTrimmed ? trimmedResponse + '...' : gptResponse

        console.log(`Sending response back to user`);

        const followUpEndpoint = `webhooks/${process.env.APP_ID}/${token}/messages/@original`

        await DiscordRequest(followUpEndpoint, {
           method: 'PATCH', 
           body: { 
            content: `**Prompt** \n${formattedMessage} \n\n**AI Response**\n${formattedResponse}` 
          } 
        });

        console.log(`Follow up response code ${followup.status}`);
      } catch (err) {
        console.error("Failed to send response: ", err);
      }
    } else {
      console.error(`Unknown command: ${name}`);
    }
  } else {
    console.error('Unknown interaction type', type);
    res.status(400).json({ error: 'Unknown interaction type' });
  }
});

export default app;