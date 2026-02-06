
import { GoogleGenAI } from "@google/genai";
import { PersonaId, Language } from "../types";

const fetchWithRetry = async (fn: () => Promise<any>, retries = 4, delay = 3000): Promise<any> => {
  try {
    return await fn();
  } catch (error: any) {
    const errorMessage = error?.message?.toLowerCase() || "";
    const isRateLimited = 
      error?.status === 429 || 
      errorMessage.includes('429') || 
      errorMessage.includes('quota') || 
      errorMessage.includes('resource_exhausted') ||
      errorMessage.includes('limit');

    if (retries > 0 && isRateLimited) {
      // Add jitter to prevent thundering herd
      const jitter = Math.random() * 1000;
      const nextDelay = delay + jitter;
      
      console.warn(`Gemini Quota hit. Retrying in ${Math.round(nextDelay)}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, nextDelay));
      return fetchWithRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

export const generateRoast = async (hours: number, price: number, itemName: string, personaId: PersonaId, lang: Language): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const langNames: Record<Language, string> = {
    ru: 'RUSSIAN', en: 'ENGLISH', th: 'THAI', zh: 'CHINESE', hi: 'HINDI', ar: 'ARABIC', fr: 'FRENCH', it: 'ITALIAN'
  };

  let personaInstruction = "";
  const isCheap = hours < 0.5;

  switch (personaId) {
    case 'bro':
      personaInstruction = `You are a supportive Bro. ${isCheap ? 'Encourage: Cheap gain, bro!' : 'Reality check: Dude, too much work. Chill.'} SLANG: bro, dude, grind.`;
      break;
    case 'sister':
      personaInstruction = `You are a Sassy Sister. ${isCheap ? 'Support: Treat yourself!' : 'Judgment: Honey, no. Slay elsewhere.'} SLANG: honey, queen, period.`;
      break;
    case 'ceo':
      personaInstruction = `You are a Savage CEO. ${isCheap ? 'Dismissive: Rounding error.' : 'Roast: Capital inefficiency. Asset over liability.'} SLANG: ROI, capital.`;
      break;
    case 'nomad':
      personaInstruction = `You are a Chill Nomad. ${isCheap ? 'Chill: Less than a coconut.' : 'Shock: That is weeks of Bali beachfront living.'} SLANG: Tom Yam, freedom.`;
      break;
    case 'mom':
      personaInstruction = `You are an Eastern Mom. ${isCheap ? 'Practical: Good deal.' : 'Guilt: Wasteful! Groceries for a month.'} SLANG: groceries, future.`;
      break;
    case 'crypto':
      personaInstruction = `You are a Crypto Bro. ${isCheap ? 'Whatever: Dust play.' : 'Panic: Opportunity cost! Paper hands selling the bottom.'} SLANG: moon, satoshis.`;
      break;
    default:
      personaInstruction = "Concise financial advisor.";
  }

  const prompt = `Item: "${itemName}". Cost in Hours: ${hours.toFixed(1)}. Analyze based on persona. Brief (1 sentence). RESPOND ONLY IN ${langNames[lang]}. Persona: ${personaInstruction}`;

  return await fetchWithRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { 
        temperature: 0.9,
        maxOutputTokens: 100,
        thinkingConfig: { thinkingBudget: 0 }
      },
    });
    return response.text.replace(/^"|"$/g, '').trim();
  });
};
