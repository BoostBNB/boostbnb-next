"use server";

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function askChatGPT(prompt: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    return response.choices[0]?.message?.content || 'No response from ChatGPT';
  } catch (error) {
    console.error('Error querying ChatGPT:', error);
    throw new Error('Failed to query ChatGPT');
  }
}



