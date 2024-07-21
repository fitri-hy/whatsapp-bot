async function handleMessage(sock, message) {
    const messageText = message.message.conversation;
    const remoteJid = message.key.remoteJid;

    if (messageText && messageText.startsWith('.bot')) {
        const responseText = 'Hi, I am Bot';
        console.log(`Replying to ${remoteJid} with "${responseText}"`);
        await sock.sendMessage(remoteJid, { text: responseText }, { quoted: message });
    }
}

module.exports = { handleMessage };
