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
  // Interaction type and data
  const { type, data } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  // acknowledge request
  res.send({ type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE });
  
  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name, options } = data;

    if (name === 'prompt') {
      const messageOption = options?.find(option => option.name === 'message');
      const message = messageOption.value;
      
      console.log(`Received message: ${message}`);
      console.log(`Generating GPT response...`);
      
      let gptResponse = await getGptResponse(message);

      console.log(`Sending response back to user`);

      try{
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `**Prompt** \n${message} \n\n**AI Response**\n${gptResponse}`
          },
        });
      }
      catch(err){
        console.error("Failed to send response: ", err);
        return res.status(500).json({ error: 'Failed to send response' });
      } 
    }
    console.error(`unknown command: ${name}`);
    return res.status(400).json({ error: 'unknown command' });
  }

  console.error('unknown interaction type', type);
  return res.status(400).json({ error: 'unknown interaction type' });
});

export default app;