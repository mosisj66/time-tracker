import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { LogAction } from '../types';

const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;

if (API_KEY && API_KEY !== "YOUR_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI:", error);
    ai = null; // Ensure ai is null if initialization fails
  }
} else {
  console.warn(
    "Gemini API Key is not configured or is using the placeholder. AI features will rely on mock responses."
  );
}

const MODEL_NAME = 'gemini-2.5-flash-preview-04-17';

export interface ManagerNotificationDetails {
  employeeName: string;
  action: LogAction;
  time: Date;
}

export const generateManagerNotification = async (
  details: ManagerNotificationDetails
): Promise<string> => {
  if (!ai) {
    console.warn("Gemini AI client not initialized. Returning mock notification.");
    const mockMessage = `(شبیه‌سازی شده) پیام به مدیر: کارمند ${details.employeeName} در ساعت ${details.time.toLocaleTimeString('fa-IR')} ${details.action === LogAction.Login ? 'وارد شد' : 'خارج شد'}.`;
    return Promise.resolve(mockMessage);
  }

  const { employeeName, action, time } = details;

  const actionVerb = action === LogAction.Login ? 'وارد شد' : 'خارج شد';
  const prompt = `یک پیام کوتاه و رسمی برای مدیر بنویسید به زبان فارسی. این پیام باید اطلاع دهد که کارمند "${employeeName}" در تاریخ ${time.toLocaleDateString('fa-IR')} ساعت ${time.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })} ${actionVerb}. پیام باید بسیار مختصر و واضح باشد.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
    });
    // Use .text directly as per guidelines
    const textResponse = response.text; 
    if (typeof textResponse === 'string') {
      return textResponse;
    } else {
      // This case should ideally not happen if the API behaves as expected for text prompts
      console.error("Received unexpected response format from Gemini:", response);
      throw new Error("پاسخ دریافتی از سرویس در فرمت مورد انتظار نیست.");
    }

  } catch (error: any) {
    console.error("Error generating manager notification via Gemini:", error);
    if (error && error.message) {
        if (error.message.toLowerCase().includes("api key not valid") || error.message.toLowerCase().includes("invalid api key")) {
             throw new Error("کلید API نامعتبر است یا منقضی شده. لطفا تنظیمات خود را بررسی کنید.");
        }
         throw new Error(`خطا در ارتباط با سرویس اعلان Gemini: ${error.message}`);
    }
    throw new Error("خطای ناشناخته در ارتباط با سرویس اعلان Gemini. لطفا بعدا تلاش کنید.");
  }
};