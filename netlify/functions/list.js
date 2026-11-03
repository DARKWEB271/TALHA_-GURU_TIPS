import { getStore, connectLambda } from "@netlify/blobs";

export async function handler(event, context) {
  // Yeh line add karein:
  connectLambda(event);
  
  try {
    // ... baqi code waisa hi rahega ...
  }
}
