import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  verifyKeyMiddleware,
} from 'discord-interactions';
import getGptResponse from './getGptResponse.js';
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

        console.log(`Sending response back to user`);

        // Send the follow-up response
        await fetch(`https://discord.com/api/v10/interactions/${id}/${token}/callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bot ${process.env.BOT_TOKEN}`
          },
          body: JSON.stringify({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `**Prompt** \n${message} \n\n**AI Response**\n${gptResponse}`
            }
          })
        });
      } catch (err) {
        console.error("Failed to send response: ", err);

        // Send a follow-up message indicating the error
        await fetch(`https://discord.com/api/v10/interactions/${id}/${token}/callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bot ${process.env.BOT_TOKEN}`
          },
          body: JSON.stringify({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: 'Failed to generate a response. Please try again later.'
            }
          })
        });
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