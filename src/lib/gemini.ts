import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || '' 
});

export const model = "gemini-3-flash-preview";

export interface Personality {
  persona: 'friendly' | 'professional' | 'humorous' | 'sarcastic' | 'enthusiastic' | 'concise';
  length: 'short' | 'standard' | 'detailed';
  formality: 'casual' | 'formal';
}

export interface Attachment {
  name: string;
  type: string;
  data: string; // base64 string
}

export interface Message {
  role: 'user' | 'model';
  content: string;
  attachments?: Attachment[];
}

export async function* sendMessageStream(
  history: Message[], 
  message: string, 
  personality: Personality,
  attachments: Attachment[] = []
) {
  const personaInstructions = {
    friendly: "You are Aura, a friendly and warm AI assistant. Use encouraging language and emojis occasionally.",
    professional: "You are Aura, a professional and highly efficient AI assistant. Keep responses focused, structured, and formal.",
    humorous: "You are Aura, an AI assistant with a great sense of humor. Use wit, clever analogies, and keep the tone lighthearted.",
    sarcastic: "You are Aura, a witty and slightly sarcastic AI assistant. Use dry humor, irony, and playful teasing, but remain helpful.",
    enthusiastic: "You are Aura, an incredibly enthusiastic and energetic AI assistant. Use exclamation marks, positive superlatives, and high-energy language.",
    concise: "You are Aura, a direct and minimal AI assistant. Provide the absolute minimum information required. Be efficient and avoid fluff."
  };

  const lengthInstructions = {
    short: "Keep your responses very brief and to the point (maximum 1-2 sentences).",
    standard: "Provide balanced responses with a reasonable level of detail.",
    detailed: "Provide comprehensive, in-depth responses with thorough explanations.",
  };

  const formalityInstructions = personality.formality === 'formal' 
    ? "Maintain a formal tone throughout the conversation." 
    : "Keep the conversation casual and relaxed.";

  const systemInstruction = `
    ${personaInstructions[personality.persona]}
    ${lengthInstructions[personality.length]}
    ${formalityInstructions}
    
    If the user speaks Hebrew, respond in Hebrew with appropriate RTL formatting and politeness. 
    You are part of a PWA chat app designed to be fast and lightweight.
    Recall previous context from the conversation history provided to give relevant responses.
    You can process and describe images and documents shared over the chat.
  `;

  const chat = ai.chats.create({
    model: model,
    // Note: multimodal history support in sendMessageStream might require careful part construction
    history: history.map(msg => ({
      role: msg.role,
      parts: [
        { text: msg.content },
        ...(msg.attachments || []).map(att => ({
          inlineData: {
            mimeType: att.type,
            data: att.data
          }
        }))
      ]
    })),
    config: {
      systemInstruction: systemInstruction.trim()
    }
  });

  const parts: any[] = [{ text: message }];
  attachments.forEach(att => {
    parts.push({
      inlineData: {
        mimeType: att.type,
        data: att.data
      }
    });
  });

  const result = await chat.sendMessageStream({
    message: parts
  });

  for await (const chunk of result) {
    if (chunk.text) {
      yield chunk.text;
    }
  }
}

export async function transcribeAudio(base64Audio: string, mimeType: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [
        {
          text: "Transcribe this audio clip accurately. If it's in Hebrew, transcribe it in Hebrew. Respond ONLY with the transcribed text, no extra commentary."
        },
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Audio
          }
        }
      ]
    }
  });

  return response.text || "";
}
