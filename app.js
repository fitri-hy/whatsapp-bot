const express = require('express');
const path = require('path');
const makeWASocket = require('@whiskeysockets/baileys').default;
const { DisconnectReason, useMultiFileAuthState, Browsers } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const qrcode = require('qrcode');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const rimraf = require('rimraf'); // To delete directories

const app = express();
const port = 3000;

// Create HTTP server and attach socket.io
const server = http.createServer(app);
const io = socketIo(server);

// Setup EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Data storage
let qrCodeUrl = null;
let connectionInfo = 'Disconnected';

// Rute untuk halaman utama
app.get('/', (req, res) => {
    res.render('home', { qr: qrCodeUrl, connectionInfo });
});

// Endpoint untuk logout
app.post('/logout', async (req, res) => {
    // Delete auth folder
    try {
        rimraf.sync('auth_info_baileys'); // Remove the folder and its contents
        connectionInfo = 'Disconnected';
        qrCodeUrl = null;
        console.log('Logged out and credentials removed');

        // Emit event to update QR code
        io.emit('qr', qrCodeUrl);
        io.emit('connection-info', connectionInfo);

        res.redirect('/');
    } catch (err) {
        console.error('Error during logout', err);
        res.status(500).send('Error during logout');
    }
});

// Fungsi untuk menghubungkan WhatsApp
async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false, // Disable terminal QR code printing
        browser: Browsers.macOS('Desktop'),
        syncFullHistory: true
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error instanceof Boom) && (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut);
            console.log('Connection closed due to', lastDisconnect.error, ', reconnecting', shouldReconnect);
            if (shouldReconnect) {
                connectToWhatsApp();
            }
        } else if (connection === 'open') {
            console.log('Opened connection');
            connectionInfo = 'Connected';
            qrCodeUrl = null; // Clear QR code URL
            io.emit('connection-info', connectionInfo); // Notify clients about connection status
        } else if (qr) {
            qrcode.toDataURL(qr, (err, url) => {
                if (!err) {
                    qrCodeUrl = url;
                    console.log('Generated QR code');
                    io.emit('qr', qrCodeUrl); // Emit QR code URL to clients
                }
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
}

// Start the server and connect to WhatsApp
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    connectToWhatsApp();
});
