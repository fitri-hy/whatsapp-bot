const { WhatsappUtils } = require('./utils/WhatsappUtils');
const { MessageUtils } = require('./utils/MessageUtils');

WhatsappUtils(MessageUtils).catch(err => console.error('Failed to connect to WhatsApp:', err));
