
// The frontend cannot rely on process.env at module-evaluation time and the
// @google/genai client may not be available in all environments. To avoid
// crashing the app at import time (which prevents the UI from loading when an
// API key isn't configured), we only attempt to call the real API at function
// runtime. If no API key is present we return a mock lesson so the UI can be
// tested locally.

const systemInstruction = `You are a world-class programming teacher, an expert in breaking down complex topics for beginners.
Your explanations must be clear, concise, and friendly.
Structure your response as follows:
1.  **Concept Overview**: A simple, high-level explanation of the topic. Use an analogy if it helps.
2.  **Core Syntax & Rules**: Show the basic syntax and explain the rules.
3.  **Code Examples**: Provide at least two well-commented code examples demonstrating the concept in action. Use markdown for code blocks.
4.  **Key Takeaways**: A bulleted list summarizing the most important points.
Your tone should be encouraging and supportive.`;

function getApiKey(): string | undefined {
  // Try common places for an API key. In a real deployment the request should
  // be proxied through a backend and not exposed to the browser.
  const envKey = (globalThis as any)?.process?.env?.API_KEY;
  if (envKey) return envKey;
  const winKey = (globalThis as any)?.__API_KEY__;
  if (winKey) return winKey;
  return undefined;
}

export async function generateLesson(prompt: string): Promise<string> {
  const API_KEY = getApiKey();

  if (!API_KEY) {
    // Provide a deterministic mock lesson so the UI can be tested without an API key.
    return (
      '**Concept Overview**\n' +
      `A short mock lesson about: ${prompt}\n\n` +
      '**Core Syntax & Rules**\nProvide the main points here.\n\n' +
      '**Code Examples**\n' +
      '```js\n// Mock example\nconsole.log("This is a mock lesson.");\n```\n\n' +
      '**Key Takeaways**\n- This is a mock response because no API key is configured.\n- Add an API key to enable real content from Gemini.'
    );
  }

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new (GoogleGenAI as any)({ apiKey: API_KEY });
    const response = await (ai as any).models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.5,
        topK: 20,
        topP: 0.9,
      },
    });
    return response?.text || String(response);
  } catch (error) {
    console.error('Error generating content from Gemini:', error);
    // Surface a friendly message to the UI while preserving the original error in the console
    throw new Error('Failed to communicate with the AI model. See console for details.');
  }
}
