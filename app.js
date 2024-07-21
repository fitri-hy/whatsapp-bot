const express = require('express');
const path = require('path');
const http = require('http');
const fs = require('fs');
const WebSocket = require('ws');
const { startWhatsAppConnection } = require('./whatsapp');
const { broadcast, wss } = require('./ws');

const app = express();
const server = http.createServer(app);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    if (global.isAuthenticated) {
        res.redirect('/dashboard');
    } else {
        res.render('qr', { latestQRCode: global.latestQRCode });
    }
});

app.get('/dashboard', (req, res) => {
    if (global.isAuthenticated) {
        res.render('dashboard');
    } else {
        res.redirect('/');
    }
});

app.get('/logout', (req, res) => {
    if (global.sock) {
        global.sock.logout().catch(err => console.error('Logout failed:', err));
    }
    global.isAuthenticated = false;
    global.latestQRCode = '';

    broadcast({ type: 'qr', qrCodeImage: global.latestQRCode });

    const authFolderPath = path.join(__dirname, 'auth_info_baileys');
    fs.rm(authFolderPath, { recursive: true, force: true }, (err) => {
        if (err) {
            console.error('Failed to delete auth_info_baileys folder:', err);
        } else {
            console.log('auth_info_baileys folder deleted successfully.');
            startWhatsAppConnection();
        }
    });

    res.redirect('/');
});

startWhatsAppConnection();
server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
