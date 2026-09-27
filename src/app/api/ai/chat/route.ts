import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message } = await req.json();
  if (!message) return NextResponse.json({ error: "message required" }, { status: 400 });

  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "sk-placeholder") {
    return NextResponse.json({
      reply: "AI assistant is not configured. Please add OPENAI_API_KEY to enable smart replies.",
    });
  }

  const OpenAI = (await import("openai")).default;
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const r = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a helpful assistant for a B2B garment marketplace called Retailers Club. Answer queries about products, prices, MOQ, delivery, and verification." },
      { role: "user", content: message },
    ],
  });
  return NextResponse.json({ reply: r.choices[0].message.content });
}
