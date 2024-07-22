const { Parser } = require('expr-eval');

async function handleMath(sock, message) {
    const messageText = message.message.conversation;
    const remoteJid = message.key.remoteJid;

    if (messageText.startsWith('.mtk ')) {
        const expression = messageText.slice(5).trim();
        
        try {
            const parser = new Parser();
            const result = parser.evaluate(expression);

            const responseText = `Result of *${expression}* is *${result}*`;
            console.log(`Replying to ${remoteJid} with "${responseText}"`);
            await sock.sendMessage(remoteJid, { text: responseText }, { quoted: message });
        } catch (error) {
            const responseText = `TThere is an error`;
            console.log(`Replying to ${remoteJid} with "${responseText}"`);
            await sock.sendMessage(remoteJid, { text: responseText }, { quoted: message });
        }
    }
}

module.exports = handleMath;
