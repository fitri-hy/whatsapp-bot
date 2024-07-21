const WebSocket = require('ws');
const http = require('http');

const wss = new WebSocket.Server({ server: http.createServer() });

function broadcast(data) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

wss.on('connection', (ws) => {
    if (global.isAuthenticated) {
        ws.send(JSON.stringify({ type: 'status', message: 'Connected' }));
    } else {
        ws.send(JSON.stringify({ type: 'qr', qrCodeImage: global.latestQRCode }));
    }
});

module.exports = { broadcast, wss };
