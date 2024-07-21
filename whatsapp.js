const { default: makeWASocket, DisconnectReason, useMultiFileAuthState, Browsers } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode');
const { handleMessage } = require('./Message');
const { Boom } = require('@hapi/boom');
const fs = require('fs');
const path = require('path');
const { broadcast } = require('./ws');

global.latestQRCode = '';
global.isAuthenticated = false;

async function startWhatsAppConnection() {
    try {
        const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
        global.sock = makeWASocket({
            auth: state,
            printQRInTerminal: false,
            browser: Browsers.macOS('Desktop'),
            syncFullHistory: true
        });

        global.sock.ev.on('creds.update', saveCreds);

        global.sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;
            if (connection === 'close') {
                const shouldReconnect = (lastDisconnect.error instanceof Boom) && (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut);
                if (shouldReconnect) {
                    setTimeout(startWhatsAppConnection, 5000);
                }
            } else if (connection === 'open') {
                global.isAuthenticated = true;
                broadcast({ type: 'status', message: 'Connected' });
            } else if (qr) {
                try {
                    global.latestQRCode = await qrcode.toDataURL(qr);
                    broadcast({ type: 'qr', qrCodeImage: global.latestQRCode });
                } catch (error) {
                    console.error('Failed to generate QR code image:', error);
                }
            }
        });

        global.sock.ev.on('messages.upsert', async (messageUpdate) => {
			const message = messageUpdate.messages[0];
			if (message && message.message) {
				await handleMessage(global.sock, message);
			}
		});

    } catch (err) {
        console.error('Failed to connect to WhatsApp:', err);
    }
}

module.exports = { startWhatsAppConnection };
