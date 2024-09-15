import 'dotenv/config';
import { InstallGlobalCommands } from './utils.js';


// Command containing options
const PROMPT_COMMAND = {
  name: 'prompt',
  description: 'Prompt ChatGPT to generate text',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 2],
};

const ALL_COMMANDS = [PROMPT_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);