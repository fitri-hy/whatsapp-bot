const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '../config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

async function Message(sock, messages) {
    const msg = messages[0];
    const chatId = msg.key.remoteJid;
    const messageBody = (msg.message && msg.message.conversation) || (msg.message && msg.message.extendedTextMessage && msg.message.extendedTextMessage.text) || '';
	
    // Cek apakah pengirim adalah bot jika ya lanjutkan
    if (msg.key.fromMe === config.SELF_BOT) {

        // Hapus pesan jika terdapat url/domain
        if (config.ANTI_LINK) {
            const urlRegex = /https?:\/\/[^\s]+|(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/g; 
            const containsUrl = urlRegex.test(messageBody);
            if (containsUrl) {
                try {
                    await sock.sendMessage(chatId, { delete: msg.key });
                    console.log(`Message deleted: ${msg.key.id}`);
                } catch (error) {
                    console.error('Error deleting message:', error);
                }
            }
        }

        // Balas pesan dengan quoted
        if (messageBody === '.hi') {
            await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });
            try {
                const responseMessage = 'Oh hello there';
                await sock.sendMessage(chatId, { text: responseMessage }, { quoted: msg });
                console.log(`Response: ${responseMessage}`);

                await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
            } catch (error) {
                console.error('Error sending message:', error);
                await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
            }
        }

        // Group Adding User
        if (messageBody.startsWith('.add')) {
            const phoneNumber = messageBody.split(' ')[1];
            await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });
            if (phoneNumber) {
                const userJid = `${phoneNumber}@s.whatsapp.net`;
                try {
                    await sock.groupParticipantsUpdate(chatId, [userJid], "add");
                    await sock.sendMessage(chatId, { text: "User added!" }, { quoted: msg });
                    await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
                } catch (error) {
                    console.error('Error adding user:', error);
                    await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
                }
            } else {
                await sock.sendMessage(chatId, { text: "Please provide a phone number to add." }, { quoted: msg });
                await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
            }
        }

        // Group Kicked User
        if (messageBody.startsWith('.kick')) {
            const mentionedJid = msg.message.extendedTextMessage.contextInfo.mentionedJid;
            await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });
            if (mentionedJid && mentionedJid.length > 0) {
                try {
                    await sock.groupParticipantsUpdate(chatId, mentionedJid, "remove");
                    await sock.sendMessage(chatId, { text: "User(s) Kicked!" }, { quoted: msg });
                    await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
                } catch (error) {
                    console.error('Error demoting user:', error);
                    await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
                }
            } else {
                await sock.sendMessage(chatId, { text: "Please mention a user to Kick." }, { quoted: msg });
                await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
            }
        }

        // Group Promoted User
        if (messageBody.startsWith('.promote')) {
            const mentionedJid = msg.message.extendedTextMessage.contextInfo.mentionedJid;
            await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });
            if (mentionedJid && mentionedJid.length > 0) {
                try {
                    await sock.groupParticipantsUpdate(chatId, mentionedJid, "promote");
                    await sock.sendMessage(chatId, { text: "User(s) Promoted!" }, { quoted: msg });
                    await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
                } catch (error) {
                    console.error('Error promoting user:', error);
                    await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
                }
            } else {
                await sock.sendMessage(chatId, { text: "Please mention a user to Promote." }, { quoted: msg });
                await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
            }
        }

        // Group Demoted User
        if (messageBody.startsWith('.demote')) {
            const mentionedJid = msg.message.extendedTextMessage.contextInfo.mentionedJid;
            await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });
            if (mentionedJid && mentionedJid.length > 0) {
                try {
                    await sock.groupParticipantsUpdate(chatId, mentionedJid, "demote");
                    await sock.sendMessage(chatId, { text: "User(s) Demoted!" }, { quoted: msg });
                    await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
                } catch (error) {
                    console.error('Error demoting user:', error);
                    await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
                }
            } else {
                await sock.sendMessage(chatId, { text: "Please mention a user to Demote." }, { quoted: msg });
                await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
            }
        }

        // Change Group Name
        if (messageBody.startsWith('.group-name')) {
            const newName = messageBody.split(' ').slice(1).join(' ');
            await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });
            if (newName) {
                try {
                    await sock.groupUpdateSubject(chatId, newName);
                    await sock.sendMessage(chatId, { text: "Group name changed!" }, { quoted: msg });
                    await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
                } catch (error) {
                    console.error('Error changing group name:', error);
                    await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
                }
            } else {
                await sock.sendMessage(chatId, { text: "Please enter a new group name." }, { quoted: msg });
                await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
            }
        }

        // Change Group Description
        if (messageBody.startsWith('.group-desc')) {
            const newDesc = messageBody.split(' ').slice(1).join(' ');
            await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });
            if (newDesc) {
                try {
                    await sock.groupUpdateDescription(chatId, newDesc);
                    await sock.sendMessage(chatId, { text: "Group description changed!" }, { quoted: msg });
                    await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
                } catch (error) {
                    console.error('Error changing group description:', error);
                    await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
                }
            } else {
                await sock.sendMessage(chatId, { text: "Please enter a new group description." }, { quoted: msg });
                await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
            }
        }

        // Lock Chat Group
        if (messageBody === '.chat-close') {
            await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });
            try {
                await sock.groupSettingUpdate(chatId, "announcement");
                await sock.sendMessage(chatId, { text: "Chat locked! Only admins can send messages." }, { quoted: msg });
                await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
            } catch (error) {
                console.error('Error closing chat:', error);
                await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
            }
        }

        // Unlock Chat Group
        if (messageBody === '.chat-open') {
            await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });
            try {
                await sock.groupSettingUpdate(chatId, "not_announcement");
                await sock.sendMessage(chatId, { text: "Chat unlocked! Everyone can send messages." }, { quoted: msg });
                await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
            } catch (error) {
                console.error('Error opening chat:', error);
                await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
            }
        }

    }
}


module.exports = Message;