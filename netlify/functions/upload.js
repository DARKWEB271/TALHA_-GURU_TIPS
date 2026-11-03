import { getStore, connectLambda } from "@netlify/blobs";

export async function handler(event, context) {
  // Yeh line add karein:
  connectLambda(event);
  
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };
  // ... baqi code waisa hi rahega ...
}
