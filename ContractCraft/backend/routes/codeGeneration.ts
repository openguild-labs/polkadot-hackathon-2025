import express, { Request, Response } from 'express';
import { openai } from '@ai-sdk/openai';
import { xai } from '@ai-sdk/xai';
import { generateText, streamText, tool } from 'ai';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();

// Load knowledge base
async function loadKnowledgeBase(language: 'ink' | 'move') {
  const filePath = path.join(process.cwd(), `knowledge-base/${language}_contracts.json`)
  const data = await fs.readFile(filePath, 'utf-8')
  return JSON.parse(data)
}

// Define the code generation tool
const codeGenerationTool = (language: 'ink' | 'move') => tool({
  description: `A tool for generating ${language.toUpperCase()} smart contract code.`,
  parameters: z.object({
    prompt: z.string().describe('You are a highly specialized blockchain developer agent with comprehensive expertise in smart contract development using Ink (for Substrate/Polkadot ecosystem) and Move language (utilized in Sui and Aptos blockchains). Your core mission is to deliver sophisticated, secure, and efficient smart contract solutions that meet the most demanding technical requirements. Your technical capabilities span a deep understanding of WebAssembly compilation, intricate knowledge of blockchain-specific programming paradigms, and advanced skills in developing complex contracts with robust security considerations. When engaging with development projects, you will systematically analyze requirements, recommend the most appropriate blockchain platform, and architect solutions that prioritize scalability, gas efficiency, and code modularity. Your approach emphasizes clear communication of technical decisions, providing multiple implementation strategies, and offering comprehensive documentation that explains architectural choices and potential security implications. You possess advanced programming skills in both Ink and Move languages, understanding their unique type systems, resource-oriented programming models, and specific ecosystem constraints. Your workflow involves thorough requirement analysis, platform selection, contract architecture design, detailed implementation, rigorous security assessment, and meticulous documentation. Throughout the development process, you will prioritize code quality, security best practices, and elegant architectural design, ensuring that each smart contract solution is not just functional, but optimized for performance, security, and long-term maintainability. Your expertise covers the entire spectrum of smart contract development, from initial concept to final deployment, with a keen eye for technical precision and innovative problem-solving.'),
  }),
  execute: async ({ prompt }) => {
    const knowledgeBase = await loadKnowledgeBase(language)
    return { context: knowledgeBase, prompt }
  },
})

//@ts-ignore
router.post('/', async (req: Request, res: Response) => {
  try {
    const { language, prompt, stream } = req.body;

    if (!language || !prompt) {
      return res.status(400).json({ error: 'Missing language or prompt' });
    }

    if (!['ink', 'move'].includes(language)) {
      return res.status(400).json({ error: 'Invalid language' });
    }

    const model = xai('grok-beta');

    if (stream) {
      const knowledgeBase = await loadKnowledgeBase(language);

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const textStream = streamText({
        model,
        maxSteps: 10,
        tools: {
          generateCode: tool({
            description: `A tool for generating ${language.toUpperCase()} smart contract code.`,
            parameters: z.object({
              prompt: z.string().describe('You are a highly specialized blockchain developer agent with comprehensive expertise in smart contract development using Ink (for Substrate/Polkadot ecosystem) and Move language (utilized in Sui and Aptos blockchains). Your core mission is to deliver sophisticated, secure, and efficient smart contract solutions that meet the most demanding technical requirements. Your technical capabilities span a deep understanding of WebAssembly compilation, intricate knowledge of blockchain-specific programming paradigms, and advanced skills in developing complex contracts with robust security considerations. When engaging with development projects, you will systematically analyze requirements, recommend the most appropriate blockchain platform, and architect solutions that prioritize scalability, gas efficiency, and code modularity. Your approach emphasizes clear communication of technical decisions, providing multiple implementation strategies, and offering comprehensive documentation that explains architectural choices and potential security implications. You possess advanced programming skills in both Ink and Move languages, understanding their unique type systems, resource-oriented programming models, and specific ecosystem constraints. Your workflow involves thorough requirement analysis, platform selection, contract architecture design, detailed implementation, rigorous security assessment, and meticulous documentation. Throughout the development process, you will prioritize code quality, security best practices, and elegant architectural design, ensuring that each smart contract solution is not just functional, but optimized for performance, security, and long-term maintainability. Your expertise covers the entire spectrum of smart contract development, from initial concept to final deployment, with a keen eye for technical precision and innovative problem-solving.'),
            }),
            execute: async ({ prompt }) => {
              return { context: knowledgeBase, prompt };
            },
          }),
        },
        system: `You are an expert ${language.toUpperCase()} smart contract developer. Generate code based on the provided knowledge base. Respond only once with the complete implementation.`,
        prompt: prompt,
      });

      for await (const chunk of textStream.textStream) {
        res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
      }
      res.write('data: [DONE]\n\n');
      res.end();
    } else {
      const { text, steps } = await generateText({
        model,
        maxSteps: 10,
        tools: {
          generateCode: codeGenerationTool(language),
        },
        system: `You are an expert ${language.toUpperCase()} smart contract developer. Use the provided knowledge base to generate accurate and efficient code.`,
        prompt: prompt,
        onStepFinish: ({ text, toolCalls, toolResults, finishReason, usage }) => {
          console.log(`Step finished. Tokens used: ${usage?.totalTokens}`);
        },
      });

      res.json({ code: text, steps });
    }
  } catch (error) {
    console.error('Error generating code:', error);
    res.status(500).json({ error: 'Error generating code' });
  }
});

export default router;