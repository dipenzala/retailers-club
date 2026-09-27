import OpenAI from "openai";

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "sk-placeholder" });
export const EMBED_MODEL = "text-embedding-3-small";
export const CHAT_MODEL = "gpt-4o-mini";

export async function suggestProductAttributes(imageUrl: string) {
  const res = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      { role: "system", content: "You are a garment cataloguing expert. Given a product image, output JSON with keys: title, category, fabric, color, gender, tags (array), description. Only JSON." },
      { role: "user", content: [
        { type: "text", text: "Analyze this garment product." },
        { type: "image_url", image_url: { url: imageUrl } },
      ]},
    ],
    response_format: { type: "json_object" },
  });
  return JSON.parse(res.choices[0].message.content || "{}");
}

export async function parseSearchQuery(query: string) {
  const res = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      { role: "system", content: "Parse garment B2B search queries into JSON with keys: category (string|null), gender (string|null), color (string|null), fabric (string|null), priceMax (number|null), location (string|null), keywords (array). Only JSON." },
      { role: "user", content: query },
    ],
    response_format: { type: "json_object" },
  });
  return JSON.parse(res.choices[0].message.content || "{}");
}
