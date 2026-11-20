import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

const modelName = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

export const ai = genkit({
  plugins: [googleAI()],
  model: googleAI.model(modelName),
});
