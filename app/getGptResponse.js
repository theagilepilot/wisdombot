import { OpenAI } from 'openai';

const openai = new OpenAI(process.env.OPENAI_API_KEY);

export default async (prompt) => {
  console.log(`Requesting GPT Completion for prompt: ${prompt}`);
  try{
    const completion = await openai.chat.completions.create({
      messages: [
        {"role": "system", "content": "You are a helpful assistant. Limit your response to 200 words."
        },
        {"role": "user", "content": prompt}
      ],
      model: 'gpt-4o'
    });
    console.log(`Generation completed.`)
    return completion.choices[0].message.content;
  }
  catch(err){
    console.error("Failed to generate GPT response: ", err);
    return "Failed to generate GPT response";
  }
}