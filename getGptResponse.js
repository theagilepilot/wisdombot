import { OpenAI } from 'openai';

const openai = new OpenAI(process.env.OPENAI_API_KEY);

export default async (prompt) => {
  console.log(`Requesting GPT Completion for prompt: ${prompt}`);
  const completion = await openai.chat.completions.create({
      messages: [
          {
              role: 'user',
              content: prompt
          }
      ],
      model: 'gpt-4-turbo'
  })

  return completion.choices[0].message.content;
}