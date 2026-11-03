import { getStore } from "@netlify/blobs";

export async function handler(event, context) {
  try {
    const store = getStore({ name: "documents" });
    const { blobs } = await store.list();
    const files = await Promise.all(blobs.map(async (blob) => {
      const meta = await store.getMetadata(blob.key);
      return { key: blob.key, name: meta.metadata?.name || blob.key, size: meta.metadata?.size || 0 };
    }));
    return { statusCode: 200, body: JSON.stringify({ files }) };
  } catch (error) { return { statusCode: 500, body: JSON.stringify({ error: error.message }) }; }
}