import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { PRODUCTS } from "../../../constants";

// Helper to generate the system instruction from product data
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
    // 1. Validate API Key existence on the server
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("Server Error: API_KEY is missing in environment variables.");
      return NextResponse.json(
        { error: "Server Configuration Error: API Key missing." }, 
        { status: 500 }
      );
    }

    // 2. Parse request body
    const body = await req.json();
    const { history, newMessage } = body;

    if (!newMessage) {
      return NextResponse.json(
        { error: "Bad Request: Message is required." },
        { status: 400 }
      );
    }

    // 3. Initialize Gemini Client
    const ai = new GoogleGenAI({ apiKey });
    
    // 4. Transform client-side history to Gemini SDK format
    // Ensure history is an array and map strictly to the expected format
    const chatHistory = Array.isArray(history) 
      ? history.map((h: { role: string; text: string }) => ({
          role: h.role,
          parts: [{ text: h.text }]
        }))
      : [];

    // 5. Create Chat Session
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: getSystemInstruction(),
      },
      history: chatHistory
    });

    // 6. Send Message
    const result = await chat.sendMessage({ message: newMessage });
    
    // 7. Return response
    return NextResponse.json({ text: result.text });

  } catch (error) {
    console.error("Gemini API Route Error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request." }, 
      { status: 500 }
    );
  }
}