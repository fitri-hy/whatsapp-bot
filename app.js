const { default: makeWASocket, DisconnectReason, useMultiFileAuthState, Browsers } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const qrcode = require('qrcode-terminal');

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        browser: Browsers.macOS('Desktop'),
        syncFullHistory: true
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error instanceof Boom) && (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut);
            console.log('Connection closed due to', lastDisconnect.error, ', reconnecting:', shouldReconnect);
            if (shouldReconnect) {
                setTimeout(() => connectToWhatsApp().catch(err => console.error('Reconnect failed:', err)), 5000);
            }
        } else if (connection === 'open') {
            console.log('Opened connection');
            console.log('Connection status: Connected');
        } else if (qr) {
            qrcode.generate(qr, { small: true }, (code) => {
                console.log('Generated QR code:');
                console.log(code);
            });
        }
    });

    sock.ev.on('messages.upsert', async (m) => {
        const message = m.messages[0];
        if (!message || message.key.fromMe) return;

        const messageText = message.message.conversation;
        const remoteJid = message.key.remoteJid;

        if (messageText && messageText.startsWith('.bot')) {
            const responseText = 'Hi, I am Bot';
            console.log(`Replying to ${remoteJid} with "${responseText}"`);
            await sock.sendMessage(remoteJid, { text: responseText }, { quoted: message });
        }
    });

    return sock;
}

connectToWhatsApp().catch(err => console.error('Failed to connect to WhatsApp:', err));
