const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const gTTS = require('gtts');
const { GeminiMessage, GeminiImage } = require('./Gemini');
const { WikipediaSearch, WikipediaAI, WikipediaImage } = require('./Wikipedia');
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
	
	/* ======BASIC========
	// Send Message
	if (messageBody === '.send-teks') {
		await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });
		try {
			const responseMessage = "Hello";
			await sock.sendMessage(chatId, { text: responseMessage }, { quoted: msg });
			console.log(`Response: ${responseMessage}`);

			await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
		} catch (error) {
			console.error('Error sending message:', error);
			await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
		}
	}
		
	// Send Image
	if (messageBody === '.send-img') {
		await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });
		try {
			const url = "https://t3.ftcdn.net/jpg/07/66/87/68/360_F_766876856_XDPvm1sg90Ar5Hwf1jRRIHM4FNCXmhKj.jpg";
			const caption = "Hello, i'm send images";
			await sock.sendMessage(chatId, {image: {url: url}, caption: caption}, { quoted: msg });
			console.log(`Response: ${caption}\n${url}`);

			await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
		} catch (error) {
			console.error('Error sending message:', error);
			await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
		}
	}
	======BASIC======== */
	
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
		
		// Wiki AI
		if (messageBody.startsWith('.wiki-ai ')) {
			const searchQuery = messageBody.replace('.wiki-ai ', '').trim();
			await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });

			try {
				const responseMessage = await WikipediaAI(searchQuery, sock, chatId, msg);
				if (responseMessage) {
					await sock.sendMessage(chatId, { text: responseMessage, quoted: msg });
					console.log(`Response: ${responseMessage}`);
				}

				await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
			} catch (error) {
				console.error('Error sending message:', error);
				await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
			}
		}

		// Wiki Search
		if (messageBody.startsWith('.wiki-search ')) {
			const searchQuery = messageBody.replace('.wiki-search ', '').trim();
			await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });

			try {
				const responseMessage = await WikipediaSearch(searchQuery, sock, chatId, msg);
				if (responseMessage) {
					await sock.sendMessage(chatId, { text: responseMessage, quoted: msg });
					console.log(`Response: ${responseMessage}`);
				}

				await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
			} catch (error) {
				console.error('Error sending message:', error);
				await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
			}
		}
		
		// Wiki Image
		if (messageBody.startsWith('.wiki-img ')) {
			const userQuery = messageBody.slice(10).trim();
			await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });
			try {
				const { url, caption } = await WikipediaImage(userQuery);
				await sock.sendMessage(chatId, {image: {url: url}, caption: caption}, { quoted: msg });
				console.log(`Response: ${caption}\n${url}`);

				await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
			} catch (error) {
				console.error('Error sending message:', error);
				await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
			}
		}
		
		// Convert Text to Voice
		if (messageBody.startsWith('.to-voice')) {
			const textToConvert = messageBody.replace('.to-voice ', '');
			await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });

			try {
				const audioFilePath = path.join(__dirname, '../output.mp3');
				const gtts = new gTTS(textToConvert, 'id');

				gtts.save(audioFilePath, async function (err) {
					if (err) {
						console.error('Error saving audio:', err);
						await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
						return;
					}

					await sock.sendMessage(chatId, {
						audio: { url: audioFilePath },
						mimetype: 'audio/mp4',
						ptt: true,
					}, { quoted: msg });

					console.log(`Response: Audio sent ${audioFilePath}`);

					fs.unlink(audioFilePath, (unlinkErr) => {
						if (unlinkErr) {
							console.error('Error deleting audio file:', unlinkErr);
						}
					});

					await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
				});
			} catch (error) {
				await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
			}
		}
		
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
        if (messageBody.startsWith('.gemini-ai ')) {
			const question = messageBody.replace('.gemini-ai ', '').trim();
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
		
		// Gemini Image Analysis
		if (messageBody.startsWith('.gemini-img ')) {
				const quotedMessage = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
				const getPrompt = messageBody.replace('.test ', '').trim();

				if (quotedMessage?.imageMessage) {
					await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });

					const buffer = await downloadMediaMessage(
						{ message: quotedMessage },
						'buffer'
					);

					const inputFilePath = path.join(__dirname, '../input-image.jpg');
					fs.writeFileSync(inputFilePath, buffer);

					try {
						const analysisResult = await GeminiImage(inputFilePath, getPrompt);
						await sock.sendMessage(chatId, { text: analysisResult }, { quoted: msg });
						console.log(`Response: ${analysisResult}`);
					} catch (error) {
					   await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
					} finally {
						fs.unlinkSync(inputFilePath);
						await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
					}
				} else {
					await sock.sendMessage(chatId, { text: "Tidak ada gambar yang di-quote untuk dianalisis." }, { quoted: msg });
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
