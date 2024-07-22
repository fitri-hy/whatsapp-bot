const fs = require('fs');
const path = require('path');

const configMessagePath = path.join(__dirname, '../config/ConfigMessage.json');
const responses = JSON.parse(fs.readFileSync(configMessagePath, 'utf8'));

async function handleStandardResponses(sock, message) {
    const messageText = message.message.conversation;
    const remoteJid = message.key.remoteJid;

    if (messageText) {
        for (const response of responses) {
            if (messageText === response.startsWith || messageText.startsWith(response.startsWith) && messageText[response.startsWith.length] === ' ') {
                console.log(`Replying to ${remoteJid} with "${response.responseText}"`);
                await sock.sendMessage(remoteJid, { text: response.responseText }, { quoted: message });
                break;
            }
        }
    }
}

module.exports = handleStandardResponses;
