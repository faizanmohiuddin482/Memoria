import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_AI_API_KEY;

if (!apiKey) {
  throw new Error("Missing GOOGLE_AI_API_KEY environment variable");
}

export const genAI = new GoogleGenerativeAI(apiKey);

// Get chat model for query understanding
// Try multiple model names in order of preference
const MODEL_NAMES = [
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-1.0-pro",
  "gemini-pro",
  "gemini-2.5-flash-lite",
  "gemini-2.5-pro",
];

export const getChatModel = (modelName?: string) => {
  const model = modelName || MODEL_NAMES[0];
  return genAI.getGenerativeModel({ model });
};

// List available models (for debugging)
export async function listAvailableModels() {
  try {
    const models = await genAI.listModels();
    return models;
  } catch (error) {
    console.error("Error listing models:", error);
    return null;
  }
}

// Generate embedding for text using text-embedding-004
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    // Use the embedding model directly
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(text);

    // The embedding is in result.embedding.values
    if (result.embedding && result.embedding.values) {
      return result.embedding.values;
    }

    // Fallback: try accessing directly
    const resultAny = result as {
      embedding?: { values?: number[] } | number[];
    };
    const embedding =
      resultAny.embedding &&
      typeof resultAny.embedding === "object" &&
      "values" in resultAny.embedding
        ? resultAny.embedding.values
        : Array.isArray(resultAny.embedding)
        ? resultAny.embedding
        : undefined;

    if (Array.isArray(embedding)) {
      return embedding;
    }

    throw new Error("Unexpected embedding format");
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error;
  }
}

// Generate natural language response from query and memories
export async function generateResponse(
  query: string,
  relevantMemories: Array<{ content: string; created_at: string }>
): Promise<string> {
  const model = getChatModel();

  const memoriesText = relevantMemories
    .map((m, i) => `${i + 1}. ${m.content}`)
    .join("\n");

  const prompt = `You are a helpful memory assistant. Based on the following memories, answer the user's question naturally and concisely.

Memories:
${memoriesText}

User Question: ${query}

Answer:`;

  // Try multiple models if one fails
  for (const modelName of MODEL_NAMES) {
    try {
      const model = getChatModel(modelName);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      // If it's a 404/model not found error, try next model
      if (
        error?.message?.includes("404") ||
        error?.message?.includes("not found")
      ) {
        console.log(`Model ${modelName} not available, trying next...`);
        continue;
      }
      // For other errors, throw immediately
      console.error(`Error with model ${modelName}:`, error);
      throw error;
    }
  }

  // If all models failed, throw helpful error
  throw new Error(
    `None of the available models worked. Tried: ${MODEL_NAMES.join(
      ", "
    )}. Please check your API key and available models.`
  );
}
