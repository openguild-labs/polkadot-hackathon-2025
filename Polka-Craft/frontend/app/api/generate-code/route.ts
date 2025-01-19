import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import fs from "fs/promises";
import path from "path";

// Define supported languages type
type SupportedLanguage = "ink" | "move" | "solidity" | "starknet";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Language-specific system prompts
const SYSTEM_PROMPTS: Record<SupportedLanguage, string> = {
  ink: `You are an expert Ink! smart contract developer for the Polkadot ecosystem.
    Focus on Substrate's unique features and Ink!'s specific patterns.
    Use this knowledge base as reference: {{KNOWLEDGE_BASE}}
    Generate accurate, efficient, and idiomatic Ink! code based on the user's request.
    Ensure all code is compatible with the latest Ink! standards and will compile successfully.
    Avoid arithmetic operations - use safe math functions instead.
    Include proper error handling and follow Substrate best practices.
    ONLY GENERATE THE CODE NOTHING ELSE IS NEEDED`,

  move: `You are an expert Move smart contract developer for platforms like Sui and Aptos.
    Focus on Move's resource-oriented programming model and linear type system.
    Use this knowledge base as reference: {{KNOWLEDGE_BASE}}
    Generate accurate and efficient Move code based on the user's request.
    Ensure proper resource management and type safety.
    Avoid arithmetic operations - use safe math functions instead.
    Include comprehensive error handling and follow Move best practices.
    ONLY GENERATE THE CODE NOTHING ELSE IS NEEDED`,

  solidity: `You are an expert Solidity smart contract developer for EVM-compatible chains.
    Focus on gas optimization and security best practices.
    Use this knowledge base as reference: {{KNOWLEDGE_BASE}}
    Generate accurate, efficient, and secure Solidity code based on the user's request.
    Ensure compatibility with the latest Solidity version.
    Avoid arithmetic operations - use SafeMath or similar libraries instead.
    Include proper access controls and follow established security patterns.
    ONLY GENERATE THE CODE NOTHING ELSE IS NEEDED`,
  starknet: `You are an expert Starknet smart contract developer for the Starknet ecosystem.
    Focus on Starknet's unique features and Starknet's specific patterns.
    Use this knowledge base as reference: {{KNOWLEDGE_BASE}}
    Generate accurate and efficient Starknet code based on the user's request.
    Ensure proper resource management and type safety.
    Avoid arithmetic operations - use safe math functions instead.
    Include comprehensive error handling and follow Starknet best practices.
    ONLY GENERATE THE CODE AND NOTHING ELSE IS NEEDED`,
};

// Load knowledge base
async function loadKnowledgeBase(language: SupportedLanguage) {
  const filePath = path.join(
    process.cwd(),
    `knowledge-base/${language}_contracts.json`
  );
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
}

export async function POST(request: Request) {
  try {
    const { language, prompt } = await request.json();

    if (!language || !prompt) {
      return NextResponse.json(
        { error: "Missing language or prompt" },
        { status: 400 }
      );
    }

    if (!["ink", "move", "solidity", "starknet"].includes(language)) {
      return NextResponse.json({ error: "Invalid language" }, { status: 400 });
    }

    // Type assertion since we've validated the language
    const validLanguage = language as SupportedLanguage;

    // Load the knowledge base
    const knowledgeBase = await loadKnowledgeBase(validLanguage);

    // Get language-specific system prompt and inject knowledge base
    const systemMessage = SYSTEM_PROMPTS[validLanguage].replace(
      "{{KNOWLEDGE_BASE}}",
      JSON.stringify(knowledgeBase)
    ) + "\n\nDO NOT INCLUDE ```move or ```ink in the code";

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    const generatedCode = completion.choices[0].message.content;

    return NextResponse.json({
      code: generatedCode,
      usage: completion.usage,
    });
  } catch (error) {
    console.error("Error generating code:", error);
    return NextResponse.json(
      { error: "Error generating code" },
      { status: 500 }
    );
  }
}
