import { getStore } from "@netlify/blobs";

export async function handler(event, context) {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };
  try {
    const { key } = JSON.parse(event.body);
    const store = getStore({ name: "documents" });
    await store.delete(key);
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (error) { return { statusCode: 500, body: JSON.stringify({ error: error.message }) }; }
}