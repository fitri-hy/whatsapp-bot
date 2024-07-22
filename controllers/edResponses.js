const crypto = require('crypto');
const CryptoJS = require('crypto-js');

// Hashing Functions
function hashMD5(text) {
    return CryptoJS.MD5(text).toString(CryptoJS.enc.Hex);
}

function hashSHA256(text) {
    return CryptoJS.SHA256(text).toString(CryptoJS.enc.Hex);
}

function hashSHA512(text) {
    return CryptoJS.SHA512(text).toString(CryptoJS.enc.Hex);
}

function hashRIPEMD160(text) {
    return CryptoJS.RIPEMD160(text).toString(CryptoJS.enc.Hex);
}

function hashBLAKE2(text) {
    return crypto.createHash('blake2b512').update(text).digest('hex');
}

// Main Handler Function
async function handleEncryptDecrypt(sock, message) {
    const messageText = message.message.conversation;
    const remoteJid = message.key.remoteJid;

    if (messageText.startsWith('.md5 ')) {
        const [command, ...textParts] = messageText.split(' ');
        const text = textParts.join(' ');

        const hashedText = hashMD5(text);
        const responseText = `MD5 Hash: ${hashedText}`;
        console.log(`Replying to ${remoteJid} with "${responseText}"`);
        await sock.sendMessage(remoteJid, { text: responseText }, { quoted: message });

    } else if (messageText.startsWith('.sha256 ')) {
        const [command, ...textParts] = messageText.split(' ');
        const text = textParts.join(' ');

        const hashedText = hashSHA256(text);
        const responseText = `SHA-256 Hash: ${hashedText}`;
        console.log(`Replying to ${remoteJid} with "${responseText}"`);
        await sock.sendMessage(remoteJid, { text: responseText }, { quoted: message });

    } else if (messageText.startsWith('.sha512 ')) {
        const [command, ...textParts] = messageText.split(' ');
        const text = textParts.join(' ');

        const hashedText = hashSHA512(text);
        const responseText = `SHA-512 Hash: ${hashedText}`;
        console.log(`Replying to ${remoteJid} with "${responseText}"`);
        await sock.sendMessage(remoteJid, { text: responseText }, { quoted: message });

    } else if (messageText.startsWith('.ripemd160 ')) {
        const [command, ...textParts] = messageText.split(' ');
        const text = textParts.join(' ');

        const hashedText = hashRIPEMD160(text);
        const responseText = `RIPEMD-160 Hash: ${hashedText}`;
        console.log(`Replying to ${remoteJid} with "${responseText}"`);
        await sock.sendMessage(remoteJid, { text: responseText }, { quoted: message });

    } else if (messageText.startsWith('.blake2 ')) {
        const [command, ...textParts] = messageText.split(' ');
        const text = textParts.join(' ');

        const hashedText = hashBLAKE2(text);
        const responseText = `BLAKE2 Hash: ${hashedText}`;
        console.log(`Replying to ${remoteJid} with "${responseText}"`);
        await sock.sendMessage(remoteJid, { text: responseText }, { quoted: message });

    }
}

module.exports = handleEncryptDecrypt;
