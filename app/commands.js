import 'dotenv/config';
import { InstallGlobalCommands } from './utils.js';
import constants from './config/constants.js';

export default async () => {
  // Command containing options
  const PROMPT_COMMAND = {
    name: 'prompt',
    description: 'Prompt ChatGPT to generate text. Output is limited to 2000 characters.',
    type: constants.commandTypes.CHAT_INPUT,
    integration_types: [0, 1],
    contexts: [0],
    options: [
      {
        type: 3, // STRING type
        name: "message",
        description: "The message to send",
        required: true
      }
    ]
  };

  const ALL_COMMANDS = [PROMPT_COMMAND];

  console.log(`Installing global commands...`);
  try{
    await InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
    console.log(`Commands installed!`);
  }
  catch(err){
    console.error("Failed to install commands: ", err);
  }
}