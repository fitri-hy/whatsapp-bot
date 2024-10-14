const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const Message = require('../controllers/Message');

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    const sock = makeWASocket({ auth: state, printQRInTerminal: true });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
        if (connection === 'close') {
            const error = lastDisconnect?.error;
            if (error?.output?.statusCode !== DisconnectReason.loggedOut) {
                console.log('Attempting to reconnect...');
                setTimeout(startBot, 5000);
            } else {
                console.log('Bot logout.');
            }
        } else if (connection === 'open') {
            console.log('Bot Connection!');
        }
    });

    sock.ev.on('messages.upsert', async ({ messages }) => {
        await Message(sock, messages);
    });

    return sock;
}

module.exports = startBot;
