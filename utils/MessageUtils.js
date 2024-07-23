const fs = require('fs');
const handleStandardResponses = require('../controllers/standardResponses');
const handleBulkResponses = require('../controllers/bulkResponses');
const handleGemini = require('../controllers/geminiResponses');
const handleAppSearch = require('../controllers/appSearchResponses');
const handleSeoCheck = require('../controllers/seoCheckResponses');
const handleMath = require('../controllers/mathResponses');
const handleEncryptDecrypt = require('../controllers/edResponses');
const handleTranslate = require('../controllers/translateResponses');

async function handleMessage(sock, message) {
    await handleStandardResponses(sock, message);
    await handleBulkResponses(sock, message);
    await handleGemini(sock, message);
    await handleAppSearch(sock, message);
    await handleSeoCheck(sock, message);
    await handleMath(sock, message);
    await handleEncryptDecrypt(sock, message);
    await handleTranslate(sock, message);
}

module.exports = { handleMessage };
