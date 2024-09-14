const axios = require('axios');

async function handleAppSearch(sock, message) {
    const messageText = message.message.conversation;
    const remoteJid = message.key.remoteJid;

    if (messageText.startsWith('.app ')) {
        const query = messageText.slice(4).trim();

        async function getResponse(query) {
            try {
                const response = await axios.get(`https://api.i-as.dev/api/app/${encodeURIComponent(query)}`);
                const apps = response.data;

                const formattedResponse = apps.map(app => {
                    return `*Title*: ${app.title}\n*Developer*: ${app.developer}\n*Link*: ${app.link}\n`;
                }).join('\n');

                return formattedResponse;
            } catch (error) {
                console.error('Error fetching searching app response:', error);
                return 'Sorry, I could not get a response from the searching app.';
            }
        }

        const apiResponse = await getResponse(query);

        console.log(`Replying to ${remoteJid} with "${apiResponse}"`);
        await sock.sendMessage(remoteJid, { text: apiResponse }, { quoted: message });
    }
}

module.exports = handleAppSearch;
