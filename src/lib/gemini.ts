import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize Gemini API
// Use dummy key if missing to avoid immediate instantiation error, 
// though we handle empty key check below.
const genAI = new GoogleGenerativeAI(API_KEY || "dummy-key");

export interface TransportRoute {
    busNumbers: string[];
    frequency: string;
    steps: string[];
    estimatedTime: string;
}

const MOCK_ROUTE: TransportRoute = {
    busNumbers: ["225L", "290U", "Metro Red"],
    frequency: "Every 15-20 mins",
    steps: [
        "Walk to Main Gate Bus Stop (5 mins).",
        "Board Bus 225L towards JNTU / Miyapur.",
        "Get down at JNTU Metro Station.",
        "Take Metro or Bus to your destination."
    ],
    estimatedTime: "45-60 mins"
};

export const getPublicTransportRoute = async (destination: string): Promise<TransportRoute> => {
    // 1. Direct Fallback if No Key
    if (!API_KEY) {
        console.warn("Gemini API Key missing. Using Mock Data.");
        return new Promise((resolve) => setTimeout(() => resolve(MOCK_ROUTE), 1000));
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `I am at KLH University Bowrampet (Hyderabad). I need to go to ${destination} using public transport (RTC bus/Metro). 
    Provide a structured travel plan used by students.
    Return STRICTLY a JSON object with this schema:
    {
      "busNumbers": ["list", "of", "bus/metro", "numbers"],
      "frequency": "estimated frequency string",
      "steps": ["step 1", "step 2", "detailed instructions"],
      "estimatedTime": "estimated duration string"
    }
    Do not add markdown formatting or backticks. Just the raw JSON string.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up if model returns markdown code blocks
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(cleanText) as TransportRoute;

    } catch (error) {
        console.error("Gemini API Error (Falling back to Mock):", error);
        // 2. Safe Fallback on API Error
        // This ensures the user always sees a result, even if their key is invalid or quota exceeded.
        return MOCK_ROUTE;
    }
};
