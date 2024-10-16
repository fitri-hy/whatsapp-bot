const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const configPath = path.join(__dirname, '../config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

const genAI = new GoogleGenerativeAI(config.GEMINI_API);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

function fileToGenerativePart(filePath, mimeType) {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(filePath)).toString('base64'),
            mimeType,
        },
    };
}

async function GeminiImage(imagePath, getPrompt) {
    try {
        const imagePart = fileToGenerativePart(imagePath, "image/jpeg");

        const result = await model.generateContent([getPrompt, imagePart]);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error analyzing image:', error);
        throw error;
    }
}

async function GeminiMessage(question) {
    try {
        const result = await model.generateContent(question);
        return result.response.text();
    } catch (error) {
        console.error('Error generating message:', error);
        throw error;
    }
}

module.exports = { GeminiMessage, GeminiImage  };
