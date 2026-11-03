import { getStore } from "@netlify/blobs";

export async function handler(event, context) {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };
  try {
    const store = getStore({ name: "documents", consistency: "strong" });
    const formData = await event.formData?.() || new Response(event.body).formData();
    const file = formData.get("file");
    if (!file) return { statusCode: 400, body: JSON.stringify({ error: "No file" }) };
    const key = `${Date.now()}-${file.name}`;
    await store.set(key, file.stream(), { metadata: { name: file.name, size: file.size, type: file.type } });
    return { statusCode: 200, body: JSON.stringify({ success: true, key, name: file.name, size: file.size }) };
  } catch (error) { return { statusCode: 500, body: JSON.stringify({ error: error.message }) }; }
}