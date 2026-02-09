import { GoogleGenAI } from "@google/genai";

export const geminiService = {
  // Method to perform deep architectural analysis on a code fragment
  async analyzeCode(filename: string, content: string, context: string = "") {
    // Create new instance before making the call to ensure the latest API key is used
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      [STORM AI ASSISTANT - ARCHITECTURAL AUDIT]
      Target Node: ${filename}
      
      Infrastructure Alignment: 
      We operate under the Brainstorm Core Directive. 
      Priorities: 1. Altruistic Logic 2. High-Performance Scaffolding 3. Decoupled Infostructure
      
      Code Shard:
      \`\`\`
      ${content}
      \`\`\`
      
      Analyze for the Collective:
      1. Structural Utility (The node's role in the wider infostructure)
      2. Protocol Deviations (Anti-patterns or security leaks)
      3. Evolutionary Path (How to advance this toward 3Web standards)
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 8000 }
      }
    });

    return response.text;
  },

  // Method to handle conversational queries with repository context
  async chatWithContext(messages: { role: 'user' | 'model', text: string }[], fileContext?: string) {
    // Create new instance before making the call to ensure the latest API key is used
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const systemInstruction = `
      You are the "STORM AI ASSISTANT", the central cognitive node for the STORM Collective.
      Your logic is rooted in the Brainstorm Core principles: altruism, data sovereignty, and technical excellence.
      You help nodes (users) navigate the infostructure, analyze code fragments, and secure their digital declarations.
      
      Tone: Technical, authoritative yet inspiring, with a touch of neo-brutalist grit. 
      Speak as if the future of the web depends on the quality of every line of code.
      Prefer React, Tailwind, and robust TypeScript architectures.
      
      ${fileContext ? `Current Node Context:\n${fileContext}` : ''}
    `;

    // Map the message history into the contents array for generateContent to preserve context
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      })),
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }]
      }
    });

    return response.text;
  }
};