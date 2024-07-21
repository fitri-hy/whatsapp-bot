const { connectToWhatsApp } = require('./whatsappModule');
const { handleMessage } = require('./Message');

connectToWhatsApp(handleMessage).catch(err => console.error('Failed to connect to WhatsApp:', err));
