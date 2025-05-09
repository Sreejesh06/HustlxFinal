import OpenAI from "openai";

// This file is kept as a backup for reference
// We're now using groqai.ts for AI functionality
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "demo-api-key" });

// Function definitions removed as they've been moved to groqai.ts
export async function generateSkillSuggestions() { 
  throw new Error("This function is deprecated. Use the one in groqai.ts instead.");
}

export async function analyzeAssessmentResponses() {
  throw new Error("This function is deprecated. Use the one in groqai.ts instead.");
}

export async function generateBusinessSuggestions() {
  throw new Error("This function is deprecated. Use the one in groqai.ts instead.");
}

export async function suggestMentors() {
  throw new Error("This function is deprecated. Use the one in groqai.ts instead.");
}