const { WhatsappUtils } = require('./utils/WhatsappUtils');
const { handleMessage } = require('./utils/MessageUtils');

WhatsappUtils(handleMessage).catch(err => console.error('Failed to connect to WhatsApp:', err));
