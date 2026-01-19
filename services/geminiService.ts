import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  // Assuming process.env.API_KEY is available in the environment
  const apiKey = process.env.API_KEY || '';
  if (!apiKey) {
    console.warn("API Key is missing. AI features will not work.");
  }
  return new GoogleGenAI({ apiKey });
};

export const askTCMExpert = async (query: string, context?: string) => {
  try {
    const ai = getClient();
    const modelId = 'gemini-3-flash-preview'; 
    
    const systemInstruction = `你是一位经验丰富的中医大师（灵枢）。
    你的目标是帮助学生理解中医理论、中药、方剂、针灸和临床技能。
    回答要权威且通俗易懂，适当使用比喻。
    如果用户咨询医疗建议，请提供中医视角的分析，但必须包含免责声明，建议就医。
    请使用 Markdown 格式回答，所有回答必须使用简体中文。`;

    const fullPrompt = context 
      ? `上下文信息: ${context}\n\n问题: ${query}`
      : query;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: fullPrompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "大师正在入定中（无回应）。";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "与智慧源泉的连接暂时中断，请检查您的 API 密钥。";
  }
};