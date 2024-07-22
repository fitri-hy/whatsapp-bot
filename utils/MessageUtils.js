const fs = require('fs');
const path = require('path');

// Baca file konfigurasi
const configMessagePath = path.join(__dirname, '../config/ConfigMessage.json');
const configMessageBulkPath = path.join(__dirname, '../config/ConfigMessageBulk.json');

const responses = JSON.parse(fs.readFileSync(configMessagePath, 'utf8'));
const bulkConfig = JSON.parse(fs.readFileSync(configMessageBulkPath, 'utf8'));

// Ambil bulk recipients dan message dari bulkConfig
const bulkRecipients = bulkConfig.bulk.recipients;
const bulkMessage = bulkConfig.bulk.message;

async function handleMessage(sock, message) {
    const messageText = message.message.conversation;
    const remoteJid = message.key.remoteJid;

    if (messageText) {
        // Menangani pesan biasa
        for (const response of responses) {
            if (messageText.startsWith(response.startsWith)) {
                console.log(`Replying to ${remoteJid} with "${response.responseText}"`);
                await sock.sendMessage(remoteJid, { text: response.responseText }, { quoted: message });
                break;
            }
        }
        
        // Menangani bulk send message
        if (messageText.startsWith('.bulk start')) {
            console.log(`Sending bulk message: "${bulkMessage.responseText}"`);
            for (const recipient of bulkRecipients) {
                try {
                    await sock.sendMessage(recipient, { text: bulkMessage.responseText });
                    console.log(`Bulk message sent to ${recipient}`);
                } catch (error) {
                    console.error(`Failed to send Bulk message to ${recipient}:`, error);
                }
            }
        }
        
        // Menangani pesan custom
        if (messageText.startsWith('.custom')) {
            const responseText = 'Hi, I am Bot custom';
            console.log(`Replying to ${remoteJid} with "${responseText}"`);
            await sock.sendMessage(remoteJid, { text: responseText }, { quoted: message });
        }
    }
}

module.exports = { handleMessage };
