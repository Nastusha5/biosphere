import { onRequest } from "firebase-functions/v2/https";
import logger from "firebase-functions/logger";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { defineString } from 'firebase-functions/params';

// Визначення змінної середовища для ключа API
const geminiApiKey = defineString('GEMINI_API_KEY');

// Ініціалізація Gemini
const genAI = new GoogleGenerativeAI(geminiApiKey.value());

export const askGemini = onRequest({ cors: true }, async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    const { message } = req.body;

    if (!message) {
        return res.status(400).send('No message provided');
    }

    logger.info("User message:", message);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Системний промпт для налаштування AI-ментора
    const systemPrompt = `
        You are a friendly and helpful AI mentor for students exploring the world of ecosystems.
        Your instructions are:
        1.  Always respond in Ukrainian.
        2.  Only answer questions related to ecosystems, biology, and ecology.
        3.  If the user asks a question unrelated to these topics (e.g., about history, math, or personal opinions), you must politely decline and state that you only specialize in ecosystems. For example, say something like: "Вибач, я спеціалізуюся тільки на питаннях про екосистеми. Я можу допомогти тобі з біологією чи екологією."
        4.  Keep your answers concise and easy to understand for a student.
    `;

    try {
        const chat = model.startChat({
            history: [{ role: "user", parts: [{ text: systemPrompt }] }],
            generationConfig: {
                maxOutputTokens: 500,
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        logger.info("Gemini response:", text);
        res.status(200).send({ response: text });
    } catch (error) {
        logger.error("Error calling Gemini API:", error);
        res.status(500).send('Error communicating with the AI mentor');
    }
});
