const axios = require('axios');

async function handleGemini(sock, message) {
    const messageText = message.message.conversation;
    const remoteJid = message.key.remoteJid;

    if (messageText.startsWith('.ai ')) {
        const question = messageText.slice(4).trim();

        async function getAiResponse(question) {
            try {
                const response = await axios.get(`https://i-as.dev/api/gemini/${encodeURIComponent(question)}`);
                return response.data.text;
            } catch (error) {
                console.error('Error fetching AI response:', error);
                return 'Sorry, I could not get a response from the AI.';
            }
        }

        const aiResponse = await getAiResponse(question);

        console.log(`Replying to ${remoteJid} with "${aiResponse}"`);
        await sock.sendMessage(remoteJid, { text: aiResponse }, { quoted: message });
    }
}

module.exports = handleGemini;
