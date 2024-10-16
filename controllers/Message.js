const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { GeminiMessage } = require('./Gemini');
const configPath = path.join(__dirname, '../config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

async function Message(sock, messages) {
    const msg = messages[0];
    const chatId = msg.key.remoteJid;
    const messageBody = (msg.message && msg.message.conversation) || (msg.message && msg.message.extendedTextMessage && msg.message.extendedTextMessage.text) || '';
	function containsBadWords(message) {
		const regex = new RegExp(`\\b(${config.BAD_WORDS.join('|')})\\b`, 'i');
		return regex.test(message);
	}
	
	// Deteksi dan hapus pesan jika ada kata kasar
	if (config.ANTI_BADWORDS) {
		if (containsBadWords(messageBody)) {
			try {
				await sock.sendMessage(chatId, { delete: msg.key });
				console.log(`Message deleted: ${msg.key.id}`);
			} catch (error) {
				console.error('Error deleting message:', error);
			}
		}
	}
	
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
	
    // Self Message
    if (msg.key.fromMe === config.SELF_BOT_MESSAGE) {
		
		// Quote Image for Generate Sticker
		if (messageBody === '.sticker') {
			const quotedMessage = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;

			if (quotedMessage?.imageMessage) {
				await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });

				const buffer = await downloadMediaMessage(
					{ message: quotedMessage },
					'buffer',
					{},
					{ reuploadRequest: sock.updateMediaMessage }
				);

				const inputFilePath = path.join(__dirname, 'input-image.jpg');
				const outputStickerPath = path.join(__dirname, 'output-sticker.webp');
				const ffmpegPath = path.join(__dirname, '../plugin/ffmpeg.exe');

				fs.writeFileSync(inputFilePath, buffer);

				const ffmpegCommand = `"${ffmpegPath}" -i "${inputFilePath}" -vf "scale=512:512" -vcodec libwebp -lossless 1 -qscale 80 -loop 0 -an -vsync 0 -preset default -t 5 "${outputStickerPath}"`;

				exec(ffmpegCommand, async (error, stdout, stderr) => {
					if (error) {
						await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
						return;
					}

					const stickerBuffer = fs.readFileSync(outputStickerPath);
					await sock.sendMessage(chatId, { sticker: stickerBuffer }, { quoted: msg });

					fs.unlinkSync(inputFilePath);
					fs.unlinkSync(outputStickerPath);

					await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
				});
			} else {
				await sock.sendMessage(chatId, { text: "Tidak ada gambar yang di-quote untuk dibuat sticker." }, { quoted: msg });
				await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
			}
		}
		
        // Gemini AI
        if (messageBody.startsWith('.gemini ')) {
            const question = messageBody.slice(8).trim();
            await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });
            try {
                const responseMessage = await GeminiMessage(question);
                await sock.sendMessage(chatId, { text: responseMessage }, { quoted: msg });
                console.log(`Response: ${responseMessage}`);
                await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
            } catch (error) {
                console.error('Error sending message:', error);
                await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
            }
        }

        // Balas pesan dengan quoted
        if (messageBody === '.menu') {
            await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });
            try {
                const responseMessage = `*AI*
• .gemini _*question*_

*Group*
• .add _*phone-number*_
• .kick _*mention*_
• .promote _*mention*_
• .demote _*mention*_
• .group-name _*new-name*_
• .group-desc _*new-desc*_
• .chat-close _(*close chat*)_
• .chat-open _(*open-chat*)_
• .antilink-true _(*undelete link*)_
• .antilink-false _(*delete link*)_`;
                await sock.sendMessage(chatId, { text: responseMessage }, { quoted: msg });
                console.log(`Response: ${responseMessage}`);

                await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
            } catch (error) {
                console.error('Error sending message:', error);
                await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
            }
        }

        if (messageBody.startsWith('.gemini ')) {
            const question = messageBody.slice(8).trim();
            await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });
            try {
                const responseMessage = await GeminiMessage(question);
                await sock.sendMessage(chatId, { text: responseMessage }, { quoted: msg });
                console.log(`Response: ${responseMessage}`);
                await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
            } catch (error) {
                console.error('Error sending message:', error);
                await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
            }
        }
    }

    // Self Utility Command
    if (msg.key.fromMe === config.SELF_BOT_UTILITY) {

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

        // Anti Link Actived
        if (messageBody === '.antilink-true') {
            await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });
            try {
                config.ANTI_LINK = true;
        
                fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
        
                const responseMessage = `Anti link actived`;
                await sock.sendMessage(chatId, { text: responseMessage }, { quoted: msg });
                console.log(`Response: ${responseMessage}`);
        
                await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
            } catch (error) {
                console.error('Error sending message:', error);
                await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
            }
        }
        
        // Anti Link Non-Actived
        if (messageBody === '.antilink-false') {
            await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });
            try {
                config.ANTI_LINK = false;
        
                fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
        
                const responseMessage = `Anti link nonactived`;
                await sock.sendMessage(chatId, { text: responseMessage }, { quoted: msg });
                console.log(`Response: ${responseMessage}`);
        
                await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
            } catch (error) {
                console.error('Error sending message:', error);
                await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
            }
        }
		
		// Badwords Actived
        if (messageBody === '.badwords-true') {
            await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });
            try {
                config.ANTI_BADWORDS = true;
        
                fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
        
                const responseMessage = "Badwords actived";
                await sock.sendMessage(chatId, { text: responseMessage }, { quoted: msg });
                console.log(`Response: ${responseMessage}`);
        
                await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
            } catch (error) {
                console.error('Error sending message:', error);
                await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
            }
        }
        
        // Badwords Non-Actived
        if (messageBody === '.badwords-false') {
            await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });
            try {
                config.ANTI_BADWORDS = false;
        
                fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
        
                const responseMessage = "Badwords nonactived";
                await sock.sendMessage(chatId, { text: responseMessage }, { quoted: msg });
                console.log(`Response: ${responseMessage}`);
        
                await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
            } catch (error) {
                console.error('Error sending message:', error);
                await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
            }
        }

    }
}


module.exports = Message;
