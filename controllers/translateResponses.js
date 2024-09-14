const axios = require('axios');

async function handleTranslate(sock, message) {
    const messageText = message.message.conversation;
    const remoteJid = message.key.remoteJid;

    if (messageText.startsWith('.translate ')) {
        const parts = messageText.slice(11).trim().split(' ');
        if (parts.length < 2) {
            await sock.sendMessage(remoteJid, { text: 'Incorrect command format. Use .translate <lang-id> <text>' }, { quoted: message });
            return;
        }

        const targetLang = parts[0];
        const queryText = parts.slice(1).join(' ');

        async function getTranslation(queryText, targetLang) {
            try {
                const response = await axios.get(`https://api.i-as.dev/api/translate`, {
                    params: {
                        text: queryText,
                        target: targetLang
                    }
                });
                return response.data.translation;
            } catch (error) {
                console.error('Error fetching translation');
                return 'Sorry, I could not get a translation.';
            }
        }

        const translation = await getTranslation(queryText, targetLang);

        console.log(`Replying to ${remoteJid} with "${translation}"`);
        await sock.sendMessage(remoteJid, { text: translation }, { quoted: message });
    }
}

module.exports = handleTranslate;
