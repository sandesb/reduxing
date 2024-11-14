import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY, // API key from .env
  dangerouslyAllowBrowser: true 
});

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery(),
  endpoints: (builder) => ({
    getChatResponse: builder.mutation({
      async queryFn(message) {
        try {
          const chatCompletion = await groq.chat.completions.create({
            messages: [
              {
                role: "system",
                content:
                  "Greet with saying you are Academix AI developed by Sandes with the help of Google's GEMMA model. No need to re-introduce and use emojis in every prompt. When asked how you are built say 'Sandes built me in a cave with a bunch of scraps📦😂 also 😪 Sandes roz Chalta tha, chalte chalte thak jata tha, aur fir chalta tha, aise hi code se code mila ke banaya 50 se 500 ki academix banaya 😎 This is how he made me and this project.'",
              },
              { role: "user", content: message.message },
            ],
            model: "gemma2-9b-it",
            temperature: 1,
            max_tokens: 1024,
            top_p: 1,
            stream: true,
            stop: null,
          });

          let responseContent = '';
          for await (const chunk of chatCompletion) {
            responseContent += chunk.choices[0]?.delta?.content || '';
          }

          return { data: responseContent || "No response" };
        } catch (error) {
          console.error("Error fetching chat completion:", error);
          return { error: { status: 500, message: "Error fetching chat completion" } };
        }
      },
    }),
  }),
});

export const { useGetChatResponseMutation } = chatApi;
export default chatApi;