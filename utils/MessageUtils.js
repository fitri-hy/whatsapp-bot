const fs = require('fs');
const path = require('path');
const handleStandardResponses = require('../controllers/standardResponses');
const handleBulkResponses = require('../controllers/bulkResponses');
const handleGemini = require('../controllers/geminiResponses');
const handleAppSearch = require('../controllers/appSearchResponses');
const handleSeoCheck = require('../controllers/seoCheckResponses');

async function handleMessage(sock, message) {
    await handleStandardResponses(sock, message);
    await handleBulkResponses(sock, message);
    await handleGemini(sock, message);
    await handleAppSearch(sock, message);
    await handleSeoCheck(sock, message);
}

module.exports = { handleMessage };
