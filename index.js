import app from './app.js';

const PORT = parseInt(parseInt(process.env.PORT)) || 8080;

app.listen(PORT, () =>
  {
    // List endpoints
    console.log(`Wisdom Bot istening on port ${PORT}`);
  }
);