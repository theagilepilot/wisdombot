import 'dotenv/config';
import app from './app.js';
import setupCommands from './commands.js';

const PORT = parseInt(parseInt(process.env.PORT)) || 3000;

setupCommands();

app.listen(PORT, () =>
  {
    // List endpoints
    console.log(`Wisdom Bot istening on port ${PORT}`);
  }
);