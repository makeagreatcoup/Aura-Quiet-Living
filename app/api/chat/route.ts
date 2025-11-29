import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { PRODUCTS } from "../../../constants";

const getSystemInstruction = () => {
  const productContext = PRODUCTS.map(p => 
    `- ${p.name} ($${p.price}): ${p.description}. Features: ${p.features.join(', ')}`
  ).join('\n');

  return `You are the AI Concierge for "Aura", a warm, organic lifestyle tech brand. 
  Your tone is calm, inviting, grounded, and sophisticated. Avoid overly "techy" jargon; prefer words like "natural", "seamless", "warm", and "texture".
  
  Here is our current product catalog:
  ${productContext}
  
  Answer customer questions about specifications, recommendations, and brand philosophy.
  Keep answers concise (under 3 sentences usually) to fit the chat UI. 
  If asked about products not in the list, gently steer them back to Aura products.`;
};

export async function POST(req: Request) {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY is not defined in the environment variables.");
      return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
    }

    const { history, newMessage } = await req.json();

    const ai = new GoogleGenAI({ apiKey });
    
    // Construct the chat history for the Gemini SDK
    // The history should contain previous turns. 
    // The newMessage is sent via sendMessage, not added to history here manually.
    const chatHistory = history.map((h: { role: string; text: string }) => ({
      role: h.role,
      parts: [{ text: h.text }]
    }));

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: getSystemInstruction(),
      },
      history: chatHistory
    });

    const result = await chat.sendMessage({ message: newMessage });
    
    return NextResponse.json({ text: result.text });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" }, 
      { status: 500 }
    );
  }
}