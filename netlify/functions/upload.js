import { getStore, connectLambda } from "@netlify/blobs";

export async function handler(event, context) {
  connectLambda(event);
  
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const store = getStore({ name: "documents", consistency: "strong" });
    
    // Parse the form data
    const boundary = event.headers['content-type'].split('boundary=')[1];
    // Since we are using simple form data, we can extract file from body if needed
    // But Netlify parses this better if we use event.body directly with proper handling.
    
    // Simple alternative: We receive file as base64 from frontend
    const body = JSON.parse(event.body);
    
    // Now we expect base64 data instead of raw form data
    if (!body.fileData || !body.fileName) {
      return { statusCode: 400, body: JSON.stringify({ error: "No file data" }) };
    }

    // Decode base64 to buffer
    const buffer = Buffer.from(body.fileData, 'base64');
    const key = `${Date.now()}-${body.fileName}`;

    await store.set(key, buffer, {
      metadata: { name: body.fileName, size: buffer.length, type: body.fileType }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, key, name: body.fileName, size: buffer.length })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
