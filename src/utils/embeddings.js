// import { GoogleAuth } from "google-auth-library";
// import axios from "axios";

// const PROJECT_ID = "alpine-surge-473109-i6"; // <-- Replace this
// const LOCATION = "us-central1";       // or the region your model is in
// const MODEL = "textembedding-gecko@001";

// const auth = new GoogleAuth({
//   scopes: ["https://www.googleapis.com/auth/cloud-platform"],
// });

// export async function getAccessToken() {
//   const client = await auth.getClient();
//   const tokenResponse = await client.getAccessToken();
//   return tokenResponse.token;
// }

// export async function getEmbedding(text) {
//   try {
//     const token = await getAccessToken();

//     const url = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL}:predict`;

//     const resp = await axios.post(
//       url,
//       { instances: [{ content: text }] },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return resp.data?.predictions?.[0]?.embeddings?.values ?? [];
//   } catch (err) {
//     console.error("getEmbedding Error:", err.response?.data || err.message);
//     throw err;
//   }
// }
// export function cosineSimilarity(a = [], b = []) { 
//     if (a.length === 0 || b.length === 0) 
//         return -1; let dot = 0, normA = 0, normB = 0; 
//     for (let i = 0; i < a.length; i++)
//          { const ai = a[i] ?? 0; const bi = b[i] ?? 0; dot += ai * bi; normA += ai * ai; normB += bi * bi; } 
//     if (normA === 0 || normB === 0) 
//         return -1; 
//     return dot / (Math.sqrt(normA) * Math.sqrt(normB)); 
// }

// import axios from "axios";
// import dotenv from 'dotenv';
// dotenv.config();

// export async function getEmbedding(text) {
//   const key = process.env.OPENAI_API_KEY;
//   const model = process.env.EMBEDDING_MODEL || "text-embedding-3-small";

//   if (!key) throw new Error("OPENAI_API_KEY not configured");

//   const url = "https://openrouter.ai/api/v1";
//   const resp = await axios.post(
//     url,
//     { input: text, model },
//     { headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" } }
//   );
//   // path: resp.data.data[0].embedding
//   return resp.data?.data?.[0]?.embedding ?? [];
// }

// /**
//  * cosineSimilarity(vecA, vecB)
//  */
// export function cosineSimilarity(a = [], b = []) {
//   if (a.length === 0 || b.length === 0) return -1;
//   let dot = 0, normA = 0, normB = 0;
//   for (let i = 0; i < a.length; i++) {
//     const ai = a[i] ?? 0;
//     const bi = b[i] ?? 0;
//     dot += ai * bi;
//     normA += ai * ai;
//     normB += bi * bi;
//   }
//   if (normA === 0 || normB === 0) return -1;
//   return dot / (Math.sqrt(normA) * Math.sqrt(normB));
// }


// import axios from "axios";
// import dotenv from "dotenv";
// dotenv.config();

// const OPENROUTER_URL = "https://openrouter.ai/api/v1";

// /**
//  * Get text embedding
//  */
// export async function getEmbedding(text) {
//   const key = process.env.OPENROUTER_API_KEY;
//   const model = process.env.EMBEDDING_MODEL || "text-embedding-3-small";

//   if (!key) throw new Error("OPENROUTER_API_KEY not configured");

//   const resp = await axios.post(
//     `${OPENROUTER_URL}/embeddings`,
//     { input: text, model },
//     {
//       headers: {
//         Authorization: `Bearer ${key}`,
//         "Content-Type": "application/json",
//       },
//     }
//   );
// console.log(resp)
//   return resp.data?.data?.[0]?.embedding ?? [];
// }

// /**
//  * Cosine similarity
//  */
// export function cosineSimilarity(a = [], b = []) {
//   if (a.length === 0 || b.length === 0) return -1;
//   let dot = 0,
//     normA = 0,
//     normB = 0;
//   for (let i = 0; i < a.length; i++) {
//     const ai = a[i] ?? 0;
//     const bi = b[i] ?? 0;
//     dot += ai * bi;
//     normA += ai * ai;
//     normB += bi * bi;
//   }
//   if (normA === 0 || normB === 0) return -1;
//   return dot / 
// (Math.sqrt(normA) * Math.sqrt(normB));
// }

import axios from "axios";
import dotenv from 'dotenv';
 dotenv.config();

export async function getEmbedding(text) {
  const key = process.env.PINECONE_API_KEY; // your Pinecone API key
  if (!key) throw new Error("PINECONE_API_KEY not configured");

  const resp = await axios.post(
    "https://api.pinecone.io/embed",
    {
      model: "llama-text-embed-v2",
      parameters: {
        input_type: "passage",
        truncate: "END",
      },
      inputs: [{ text }],
    },
    {
      headers: {
        "Api-Key": key,
        "Content-Type": "application/json",
        "X-Pinecone-API-Version": "2025-10",
      },
    }
  );

 console.log(resp);  // Log the full response
console.log(resp.data); // Check if data exists
console.log(resp.data.data[0].values); // Check the first element in the data array// check the raw response
  return resp.data?.data[0].values;
}

/**
 * Cosine similarity
 */
export function cosineSimilarity(a = [], b = []) {
  if (a.length === 0 || b.length === 0) return -1;
  let dot = 0,
    normA = 0,
    normB = 0;
  for (let i = 0; i < a.length; i++) {
    const ai = a[i] ?? 0;
    const bi = b[i] ?? 0;
    dot += ai * bi;
    normA += ai * ai;
    normB += bi * bi;
  }
  if (normA === 0 || normB === 0) return -1;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}