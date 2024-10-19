const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const gTTS = require('gtts');
const { Octokit } = require('@octokit/rest');
const QRCode = require('qrcode');
const { GeminiMessage, GeminiImage } = require('./Gemini');
const { WikipediaSearch, WikipediaAI, WikipediaImage } = require('./Wikipedia');
const { Weather } = require('./Weather');
const { Translate } = require('./Translates');
const { Surah, SurahDetails } = require('./Quran');
const { Country } = require('./Country');
const { CheckSEO } = require('./SEO');
const { FileSearch } = require('./FileSearch');
const { AesEncryption, AesDecryption, CamelliaEncryption, CamelliaDecryption, ShaEncryption, Md5Encryption, RipemdEncryption, BcryptEncryption } = require('./Tools.js');
const { YoutubeVideo, YoutubeAudio, FacebookVideo, FacebookAudio, TwitterVideo, TwitterAudio, InstagramVideo, InstagramAudio, TikTokVideo, TikTokAudio, VimeoVideo, VimeoAudio  } = require('./Downloader');
const { DetikNews, DetikViral, DetikLatest } = require('./Detik');
const { AnimeVideo, downloadImage } = require('./Anime');
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
		
		// Menu
		if (messageBody === '.menu') {
			const filePath = path.join(__dirname, '../upload/ss.jpg');
			await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });
			try {
				const url = filePath;
				const caption = 
					'*Whastapp Bot* \n\n' + 
					'Kalo mau nyolong scnya jangan lupa kasih bintang/fork reponya bro! \n' + 
					'Source : https://github.com/fitri-hy/whatsapp-bot';
				await sock.sendMessage(chatId, {image: {url: url}, caption: caption}, { quoted: msg });
				console.log(`Response: Success`);

				await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
			} catch (error) {
				console.error('Error sending message:', error);
				await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
			}
		}
		
		// Get Github Username Info
		if (messageBody.startsWith('.github ')) {
			const username = messageBody.replace('.github ', '').trim();
			await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });
			
			try {
				const octokit = new Octokit();
				const { data } = await octokit.rest.users.getByUsername({ username });
				
				const responseProfile = `${data.avatar_url}`;
				const responseMessage = `*User Github Info for ${data.login}:*\n\n` +
					`- Name: ${data.name || 'No name available'}\n` +
					`- Bio: ${data.bio || 'No bio available'}\n` +
					`- Location: ${data.location || 'No location available'}\n` +
					`- Company: ${data.company || 'No company available'}\n` +
					`- Followers: ${data.followers}\n` +
					`- Following: ${data.following}\n` +
					`- Repositories: ${data.public_repos}\n` +
					`- Public Gists: ${data.public_gists}\n` +
					`- Blog: ${data.blog ? `${data.blog}` : 'No blog available'}\n` +
					`- Created At: ${new Date(data.created_at).toLocaleDateString()}`;
					
				await sock.sendMessage(chatId, { image: { url: responseProfile }, caption: responseMessage }, { quoted: msg });
				console.log(`Response: Success get Username github data.`);

				await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
			} catch (error) {
				console.error('Error sending message:', error);
				await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
			}
		}
		
		// Anime Search
		if (messageBody.startsWith('.anime ')) {
			const encryptedText = messageBody.replace('.anime ', '').trim();
			await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });
			try {
				const result = await AnimeVideo(encryptedText);
				const tempImagePath = path.join(__dirname, '../upload/temp_image.jpg');
				const imageUrl = result.animeImgUrl || '../upload/default.jpg';

				await downloadImage(imageUrl, tempImagePath);

				let responseMessage = `*${result.title}*\n\n`;
				result.episodes.forEach((episode) => {
					responseMessage += `Episode ${episode.epNo}\n${episode.videoUrl}\n\n`;
				});

				await sock.sendMessage(chatId, { image: { url: tempImagePath }, caption: responseMessage }, { quoted: msg });
				console.log(`Success! Anime Sending..`);

				fs.unlinkSync(tempImagePath);
				await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
			} catch (error) {
				console.error('Error sending message:', error);
				await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });

				if (fs.existsSync(tempImagePath)) {
					fs.unlinkSync(tempImagePath);
				}
			}
		}
		
		// Detik Search Article
		if (messageBody.startsWith('.detik-search ')) {
			const query = messageBody.split(' ')[1];
			await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });

			try {
				const articles = await DetikNews(query);
				const responseText = articles.map(article => `${article.title}\n${article.url}`).join('\n\n');
			  
				await sock.sendMessage(chatId, { text: responseText }, { quoted: msg });
				console.log(`Response: Success Sending`);
				await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
			} catch (error) {
				console.error('Error sending search results:', error);
				await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
			}
		}
		
		// Detik Viral Article
		if (messageBody.startsWith('.detik-viral')) {
			await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });

			try {
				const articles = await DetikViral();
				const responseText = articles.map(article => `${article.title}\n${article.url}`).join('\n\n');
			  
				await sock.sendMessage(chatId, { text: responseText }, { quoted: msg });
				console.log(`Response: Success Sending`);
				await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
			} catch (error) {
				console.error('Error sending viral news:', error);
				await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
			}
		}

		// Detik News Article
		if (messageBody.startsWith('.detik-news')) {
			await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });

			try {
				const articles = await DetikLatest();
				const responseText = articles.map(article => `${article.title}\n${article.url}`).join('\n\n');
		  
				await sock.sendMessage(chatId, { text: responseText }, { quoted: msg });
				console.log(`Response: Success Sending`);
				await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
			} catch (error) {
				console.error('Error sending latest news:', error);
				await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
			}
		}
  
		// Twitter Video to MP4
		if (messageBody.startsWith('.twdl-mp4 ')) {
		  const url = messageBody.split(' ')[1];
		  await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });

		  try {
			const outputFilePath = path.join(__dirname, "../upload", "twdl-video.mp4");
			await TwitterVideo(url, outputFilePath);

			await sock.sendMessage(chatId, { video: { url: outputFilePath }, caption: "This is the video you asked for!" }, { quoted: msg });
			console.log(`Response: Success sending video ${outputFilePath}`);
			await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });

			const deleteFile = (filePath) => {
				fs.unlink(filePath, (err) => {
					if (err) {
						console.error(`Error deleting file: ${err.message}`);
					} else {
					  return;
					}
				});
			};
			deleteFile(outputFilePath);
		  } catch (error) {
			console.error('Error sending message:', error);
			await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
		  }
		}

		// Twitter Video to MP3
		if (messageBody.startsWith('.twdl-mp3 ')) {
		  const url = messageBody.split(' ')[1];
		  await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });

		  try {
			const outputFilePath = path.join(__dirname, "../upload", "twdl-audio.mp3");
			await TwitterAudio(url, outputFilePath);

			await sock.sendMessage(chatId, { audio: { url: outputFilePath }, mimetype: 'audio/mp4' }, { quoted: msg });
			console.log(`Response: Success sending video ${outputFilePath}`);
			await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });

			const deleteFile = (filePath) => {
				fs.unlink(filePath, (err) => {
					if (err) {
						console.error(`Error deleting file: ${err.message}`);
					} else {
					  return;
					}
				});
			};
			deleteFile(outputFilePath);
		  } catch (error) {
			console.error('Error sending message:', error);
			await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
		  }
		}
		
		// Instagram Video to MP4
		if (messageBody.startsWith('.igdl-mp4 ')) {
		  const url = messageBody.split(' ')[1];
		  await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });

		  try {
			const outputFilePath = path.join(__dirname, "../upload", "igdl-video.mp4");
			await InstagramVideo(url, outputFilePath);

			await sock.sendMessage(chatId, { video: { url: outputFilePath }, caption: "This is the video you asked for!" }, { quoted: msg });
			console.log(`Response: Success sending video ${outputFilePath}`);
			await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });

			const deleteFile = (filePath) => {
				fs.unlink(filePath, (err) => {
					if (err) {
						console.error(`Error deleting file: ${err.message}`);
					} else {
					  return;
					}
				});
			};
			deleteFile(outputFilePath);
		  } catch (error) {
			console.error('Error sending message:', error);
			await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
		  }
		}

		// Instagram Video to MP3
		if (messageBody.startsWith('.igdl-mp3 ')) {
		  const url = messageBody.split(' ')[1];
		  await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });

		  try {
			const outputFilePath = path.join(__dirname, "../upload", "igdl-audio.mp3");
			await InstagramAudio(url, outputFilePath);

			await sock.sendMessage(chatId, { audio: { url: outputFilePath }, mimetype: 'audio/mp4' }, { quoted: msg });
			console.log(`Response: Success sending video ${outputFilePath}`);
			await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });

			const deleteFile = (filePath) => {
				fs.unlink(filePath, (err) => {
					if (err) {
						console.error(`Error deleting file: ${err.message}`);
					} else {
					  return;
					}
				});
			};
			deleteFile(outputFilePath);
		  } catch (error) {
			console.error('Error sending message:', error);
			await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
		  }
		}
		
		// TikTok Video to MP4
		if (messageBody.startsWith('.tkdl-mp4 ')) {
		  const url = messageBody.split(' ')[1];
		  await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });

		  try {
			const outputFilePath = path.join(__dirname, "../tkdl", "twdl-video.mp4");
			await TikTokVideo(url, outputFilePath);

			await sock.sendMessage(chatId, { video: { url: outputFilePath }, caption: "This is the video you asked for!" }, { quoted: msg });
			console.log(`Response: Success sending video ${outputFilePath}`);
			await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });

			const deleteFile = (filePath) => {
				fs.unlink(filePath, (err) => {
					if (err) {
						console.error(`Error deleting file: ${err.message}`);
					} else {
					  return;
					}
				});
			};
			deleteFile(outputFilePath);
		  } catch (error) {
			console.error('Error sending message:', error);
			await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
		  }
		}

		// TikTok Video to MP3
		if (messageBody.startsWith('.tkdl-mp3 ')) {
		  const url = messageBody.split(' ')[1];
		  await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });

		  try {
			const outputFilePath = path.join(__dirname, "../upload", "tkdl-audio.mp3");
			await TikTokAudio(url, outputFilePath);

			await sock.sendMessage(chatId, { audio: { url: outputFilePath }, mimetype: 'audio/mp4' }, { quoted: msg });
			console.log(`Response: Success sending video ${outputFilePath}`);
			await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });

			const deleteFile = (filePath) => {
				fs.unlink(filePath, (err) => {
					if (err) {
						console.error(`Error deleting file: ${err.message}`);
					} else {
					  return;
					}
				});
			};
			deleteFile(outputFilePath);
		  } catch (error) {
			console.error('Error sending message:', error);
			await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
		  }
		}
		
		// Vimeo Video to MP4
		if (messageBody.startsWith('.vmdl-mp4 ')) {
		  const url = messageBody.split(' ')[1];
		  await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });

		  try {
			const outputFilePath = path.join(__dirname, "../tkdl", "vmdl-video.mp4");
			await VimeoVideo(url, outputFilePath);

			await sock.sendMessage(chatId, { video: { url: outputFilePath }, caption: "This is the video you asked for!" }, { quoted: msg });
			console.log(`Response: Success sending video ${outputFilePath}`);
			await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });

			const deleteFile = (filePath) => {
				fs.unlink(filePath, (err) => {
					if (err) {
						console.error(`Error deleting file: ${err.message}`);
					} else {
					  return;
					}
				});
			};
			deleteFile(outputFilePath);
		  } catch (error) {
			console.error('Error sending message:', error);
			await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
		  }
		}

		// Vimeo Video to MP3
		if (messageBody.startsWith('.vmdl-mp3 ')) {
		  const url = messageBody.split(' ')[1];
		  await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });

		  try {
			const outputFilePath = path.join(__dirname, "../upload", "vmdl-audio.mp3");
			await VimeoAudio(url, outputFilePath);

			await sock.sendMessage(chatId, { audio: { url: outputFilePath }, mimetype: 'audio/mp4' }, { quoted: msg });
			console.log(`Response: Success sending video ${outputFilePath}`);
			await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });

			const deleteFile = (filePath) => {
				fs.unlink(filePath, (err) => {
					if (err) {
						console.error(`Error deleting file: ${err.message}`);
					} else {
					  return;
					}
				});
			};
			deleteFile(outputFilePath);
		  } catch (error) {
			console.error('Error sending message:', error);
			await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
		  }
		}
		
		// Facebook Video to MP4
		if (messageBody.startsWith('.fbdl-mp4 ')) {
		  const url = messageBody.split(' ')[1];
		  await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });

		  try {
			const outputFilePath = path.join(__dirname, "../upload", "fbdl-video.mp4");
			await FacebookVideo(url, outputFilePath);

			await sock.sendMessage(chatId, { video: { url: outputFilePath }, caption: "This is the video you asked for!" }, { quoted: msg });
			console.log(`Response: Success sending video ${outputFilePath}`);
			await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });

			const deleteFile = (filePath) => {
				fs.unlink(filePath, (err) => {
					if (err) {
						console.error(`Error deleting file: ${err.message}`);
					} else {
					  return;
					}
				});
			};
			deleteFile(outputFilePath);
		  } catch (error) {
			console.error('Error sending message:', error);
			await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
		  }
		}

		// Facebook Video to MP3
		if (messageBody.startsWith('.fbdl-mp3 ')) {
		  const url = messageBody.split(' ')[1];
		  await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });

		  try {
			const outputFilePath = path.join(__dirname, "../upload", "fbdl-audio.mp3");
			await FacebookAudio(url, outputFilePath);

			await sock.sendMessage(chatId, { audio: { url: outputFilePath }, mimetype: 'audio/mp4' }, { quoted: msg });
			console.log(`Response: Success sending video ${outputFilePath}`);
			await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });

			const deleteFile = (filePath) => {
				fs.unlink(filePath, (err) => {
					if (err) {
						console.error(`Error deleting file: ${err.message}`);
					} else {
					  return;
					}
				});
			};
			deleteFile(outputFilePath);
		  } catch (error) {
			console.error('Error sending message:', error);
			await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
		  }
		}
		
		// Youtube Video to MP4
		if (messageBody.startsWith('.ytdl-mp4 ')) {
		  const url = messageBody.split(' ')[1];
		  await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });

		  try {
			const outputFilePath = path.join(__dirname, "../upload/ytdl-video.mp4");
			await YoutubeVideo(url, outputFilePath);
			
			await sock.sendMessage(chatId, { video: { url: outputFilePath }, caption: "This is the video you asked for!" }, { quoted: msg });
			console.log(`Response: Success sending video ${outputFilePath}`);
			await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
			
			const deleteFile = (filePath) => {
			  fs.unlink(filePath, (err) => {
				if (err) {
				  console.error(`Error deleting file: ${err.message}`);
				} else {
				  return;
				}
			  });
			};
			
			deleteFile(outputFilePath);
		  } catch (error) {
			console.error('Error sending message:', error);
			await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
		  }
		}
		
		// Youtube Video to MP3
		if (messageBody.startsWith('.ytdl-mp3 ')) {
		  const url = messageBody.split(' ')[1];
		  await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });

		  try {
			const outputFilePath = path.join(__dirname, "../upload", "ytdl-audio.mp3");
			await YoutubeAudio(url, outputFilePath);
			
			await sock.sendMessage(chatId, { audio: { url: outputFilePath }, mimetype: 'audio/mp4' }, { quoted: msg });
			console.log(`Response: Success sending audio ${outputFilePath}`);
			await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
			
			const deleteFile = (filePath) => {
			  fs.unlink(filePath, (err) => {
				if (err) {
				  console.error(`Error deleting file: ${err.message}`);
				} else {
				  return;
				}
			  });
			};
			
			deleteFile(outputFilePath);
		  } catch (error) {
			console.error('Error sending message:', error);
			await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
		  }
		}
		
		// AES Encryption & Decryption
		if (messageBody.startsWith('.aes-enc ')) {
			const text = messageBody.replace('.aes-enc ', '').trim();
			const getkey = "b14ca5898a4e4133bbce2ea2315a1916";
			await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });
			try {
				const encryptedText = await AesEncryption(text, getkey);
				await sock.sendMessage(chatId, { text: `Result AES Encryption: *${encryptedText}*` }, { quoted: msg });
				await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
			} catch (error) {
				console.log(error)
				await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
			}
		}

		if (messageBody.startsWith('.aes-dec ')) {
			const encryptedText = messageBody.replace('.aes-dec ', '').trim();
			const getkey = "b14ca5898a4e4133bbce2ea2315a1916";
			await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });
			try {
				const decryptedText = await AesDecryption(encryptedText, getkey);
				await sock.sendMessage(chatId, { text: `Result AES Decryption: *${decryptedText}*` }, { quoted: msg });
				await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
			} catch (error) {
				console.log(error)
				await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
			}
		}

		// Camellia Encryption & Decryption
		if (messageBody.startsWith('.camellia-enc ')) {
			const text = messageBody.replace('.camellia-enc ', '').trim();
			const getkey = "0123456789abcdeffedcba9876543210";
			await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });
			try {
				const encryptedText = await CamelliaEncryption(text, getkey);
				await sock.sendMessage(chatId, { text: `Result Camellia Encryption: *${encryptedText}*` }, { quoted: msg });
				await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
			} catch (error) {
				console.log(error)
				await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
			}
		}

		if (messageBody.startsWith('.camellia-dec ')) {
			const encryptedText = messageBody.replace('.camellia-dec ', '').trim();
			const getkey = "0123456789abcdeffedcba9876543210";
			await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });
			try {
				const decryptedText = await CamelliaDecryption(encryptedText, getkey);
				await sock.sendMessage(chatId, { text: `Result Camellia Decryption: *${decryptedText}*` }, { quoted: msg });
				await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
			} catch (error) {
				console.log(error)
				await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
			}
		}

		// SHA Hashing
		if (messageBody.startsWith('.sha ')) {
			const text = messageBody.replace('.sha ', '').trim();
			await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });
			try {
				const hashedText = await ShaEncryption(text);
				await sock.sendMessage(chatId, { text: `Result SHA Hashing: *${hashedText}*` }, { quoted: msg });
				await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
			} catch (error) {
				console.log(error)
				await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
			}
		}

		// MD5 Hashing
		if (messageBody.startsWith('.md5 ')) {
			const text = messageBody.replace('.md5 ', '').trim();
			await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });
			try {
				const hashedText = await Md5Encryption(text);
				await sock.sendMessage(chatId, { text: `Result MD5 Hashing: *${hashedText}*` }, { quoted: msg });
				await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
			} catch (error) {
				console.log(error)
				await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
			}
		}

		// RIPEMD Hashing
		if (messageBody.startsWith('.ripemd ')) {
			const text = messageBody.replace('.ripemd ', '').trim();
			await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });
			try {
				const hashedText = await RipemdEncryption(text);
				await sock.sendMessage(chatId, { text: `Result RIPEMD Hashing: *${hashedText}*` }, { quoted: msg });
				await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
			} catch (error) {
				console.log(error)
				await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
			}
		}

		// Bcrypt Hashing
		if (messageBody.startsWith('.bcrypt ')) {
			const text = messageBody.replace('.bcrypt ', '').trim();
			await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });
			try {
				const hashedText = await BcryptEncryption(text);
				await sock.sendMessage(chatId, { text: `Result Bcrypt Hashing: *${hashedText}*` }, { quoted: msg });
				await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
			} catch (error) {
				console.log(error)
				await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
			}
		}
		
		// File Search
		if (messageBody.startsWith('.')) {
			const parts = messageBody.split(' ');
			const fileType = parts[0].substring(1);
			const query = parts.slice(1).join(' ').trim();

			const validFileTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'html', 'htm', 'csv', 'rtf', 'odt', 'ods', 'odp', 'epub', 'zip', 'gz'];

			if (validFileTypes.includes(fileType)) {
				await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });

				try {
					const responseMessage = await FileSearch(query, fileType);
					await sock.sendMessage(chatId, { text: responseMessage }, { quoted: msg });
					console.log(`Response: ${responseMessage}`);
					await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
				} catch (error) {
					console.error('Error sending message:', error);
					await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
				}
			}
		}

		// Generate QRCode
		if (messageBody.startsWith('.qrcode ')) {
			const text = messageBody.replace('.qrcode ', '').trim();
			await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });
			
			try {
				const qrCodeFilePath = path.join(__dirname, '../upload/qrcode.png');
				await QRCode.toFile(qrCodeFilePath, text);
				const caption = `Here is your QR code for: "${text}"`;
				
				await sock.sendMessage(chatId, { image: { url: qrCodeFilePath }, caption: caption }, { quoted: msg });
				console.log(`Response: ${caption}`);

				fs.unlink(qrCodeFilePath, (err) => {
					if (err) {
						console.error('Error deleting QR code file:', err);
					} else {
						console.log('QR code file deleted successfully');
					}
				});

				await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
			} catch (error) {
				console.error('Error generating or sending QR code:', error);
				await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
			}
		}

		// Mathematics 
		if (messageBody.startsWith('.mtk ')) {
			const expression = messageBody.replace('.mtk ', '').trim();
			await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });
			
			try {
				const result = calculateExpression(expression);
				await sock.sendMessage(chatId, { text: `Result: ${result}` }, { quoted: msg });
				console.log(`Response: Result: ${result}`);
				
				await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
			} catch (error) {
				console.error('Error sending message:', error);
				await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
			}
		}

		function calculateExpression(expression) {
			const sanitizedExpression = expression.replace(/:/g, '/');
			const result = eval(sanitizedExpression);
			return result;
		}
		
		// Count Words
		if (messageBody.startsWith('.words ')) {
			const text = messageBody.replace('.words ', '').trim();
			await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });
			
			try {
				const wordCount = text ? text.split(/\s+/).length : 0;
				const characterCount = text.length;
				const spaceCount = (text.match(/\s/g) || []).length;
				const symbolCount = (text.match(/[^\w\s]/g) || []).length;
				const paragraphCount = text.split(/\n+/).length;
				const numberCount = (text.match(/\d+/g) || []).length;

				const responseMessage = 
				'*Text Analysis* \n\n' +
				`- Word Count: ${wordCount}\n` +
				`- Character Count: ${characterCount}\n` +
				`- Space Count: ${spaceCount}\n` +
				`- Symbol Count: ${symbolCount}\n` +
				`- Paragraph Count: ${paragraphCount}\n` +
				`- Number Count: ${numberCount}`;

				await sock.sendMessage(chatId, { text: responseMessage }, { quoted: msg });
				console.log(`Response: ${responseMessage}`);

				await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
			} catch (error) {
				console.error('Error sending message:', error);
				await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
			}
		}

		// Check SEO
		if (messageBody.startsWith('.seo ')) {
			const domain = messageBody.replace('.seo ', '').trim();
			await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });

			try {
				const responseMessage = await CheckSEO(domain); 

				// Format the response message into a readable string
				const formattedMessage = 
					'- SEO Success Rate: ' + responseMessage.seoSuccessRate + '\n' +
					'- Title: ' + responseMessage.title + '\n' +
					'- Meta Description: ' + responseMessage.metaDescription + '\n' +
					'- Meta Keywords: ' + responseMessage.metaKeywords + '\n' +
					'- Open Graph Title: ' + responseMessage.ogTitle + '\n' +
					'- Open Graph Description: ' + responseMessage.ogDescription + '\n' +
					'- Open Graph Image: ' + responseMessage.ogImage + '\n' +
					'- Canonical URL: ' + responseMessage.canonicalUrl + '\n' +
					'- Is Indexable: ' + (responseMessage.isIndexable ? 'Yes' : 'No');

				await sock.sendMessage(chatId, { text: formattedMessage.trim() }, { quoted: msg });
				console.log(`Response: ${formattedMessage}`);

				await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
			} catch (error) {
				console.error('Error sending message:', error);
				await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
			}
		}
		
		// Search Country Detail
		if (messageBody.startsWith('.country ')) {
			const countryName = messageBody.replace('.country ', '').trim();
			await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });
			
			try {
				const responseMessage = await Country(countryName); 

				await sock.sendMessage(chatId, { text: responseMessage }, { quoted: msg });
				console.log(`Response: ${responseMessage}`);

				await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
			} catch (error) {
				console.error('Error sending message:', error);
				await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
			}
		}
		
		// Search Surah
		if (messageBody.startsWith('.surah ')) {
			const surahId = parseInt(messageBody.split(' ')[1]);
			await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });
			
			try {
				const responseMessage = await Surah(surahId); 

				await sock.sendMessage(chatId, { text: responseMessage }, { quoted: msg });
				console.log(`Response: ${responseMessage}`);

				await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
			} catch (error) {
				console.error('Error sending message:', error);
				await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
			}
		}
		
		// Search Specific Surah
		if (messageBody.startsWith('.surah-detail ')) {
			const [surahPart, ayahPart] = messageBody.split(' ')[1].split(':');
			const surahId = parseInt(surahPart);
			const ayahId = ayahPart ? parseInt(ayahPart) : null;

			await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });

			try {
				if (ayahId) {
					const responseMessage = await SurahDetails(surahId, ayahId);
					await sock.sendMessage(chatId, { text: responseMessage }, { quoted: msg });
					console.log(`Response: ${responseMessage}`);
				} else {
					const responseMessage = await getSurahDetails(surahId);
					await sock.sendMessage(chatId, { text: responseMessage }, { quoted: msg });
					console.log(`Response: ${responseMessage}`);
				}

				await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
			} catch (error) {
				console.error('Error sending message:', error);
				await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
			}
		}
	
		// Translate
		if (messageBody.startsWith('.translate-')) {
			const langId = messageBody.split(' ')[0].split('-')[1];
			const text = messageBody.split(' ').slice(1).join(' ');

			await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });
			try {
				const translateText = await Translate(text, langId);
				await sock.sendMessage(chatId, { text: translateText }, { quoted: msg });
				console.log(`Response: ${translateText}`);

				await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
			} catch (error) {
				console.error('Error sending message:', error);
				await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
			}
		}
		
		// Weather
		if (messageBody.startsWith('.weather ')) {
			const cityName = messageBody.replace('.weather ', '').trim();
			await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });
			try {
				const weatherJson = await Weather(cityName);
				const responseMessage = `*Weather in ${cityName}*\n\nTemperature: ${weatherJson.temperature}\nCondition: ${weatherJson.condition}\nWind: ${weatherJson.wind}\nHumidity: ${weatherJson.humidity}`;

				await sock.sendMessage(chatId, { text: responseMessage }, { quoted: msg });
				console.log(`Response: ${responseMessage}`);

				await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
			} catch (error) {
				console.error('Error sending message:', error);
				await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
			}
		}
		
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
				const audioFilePath = path.join(__dirname, '../upload/output.mp3');
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

				const inputFilePath = path.join(__dirname, '../upload/input-image.jpg');
				const outputStickerPath = path.join(__dirname, '../upload/output-sticker.webp');
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
                const geminiPrompt = `${config.GEMINI_PROMPT}: ${question}`;
                const responseMessage = await GeminiMessage(geminiPrompt);
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
			const getPrompt = messageBody.replace('.gemini-img ', '').trim();

			if (quotedMessage?.imageMessage) {
				await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });
				const buffer = await downloadMediaMessage(
					{ message: quotedMessage },
					'buffer'
				);
				const inputFilePath = path.join(__dirname, '../upload/input-image.jpg');
				fs.writeFileSync(inputFilePath, buffer);
				try {
					const geminiPromptImg = `${config.GEMINI_PROMPT}: ${getPrompt}`;
					const analysisResult = await GeminiImage(inputFilePath, geminiPromptImg);
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
		
		// Self Bot Use Non-Actived
        if (messageBody === '.self-false') {
            await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });
            try {
                config.SELF_BOT_MESSAGE = false;
                fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
                console.log(`Response: Self Bot Use Non-Actived`);
                await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
            } catch (error) {
                console.error('Error sending message:', error);
                await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
            }
        }
		
		// Self Bot Use Actived
        if (messageBody === '.self-true') {
            await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });
            try {
                config.SELF_BOT_MESSAGE = true;
                fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
                console.log(`Response: Self Bot Use Actived`);
                await sock.sendMessage(chatId, { react: { text: "✅", key: msg.key } });
            } catch (error) {
                console.error('Error sending message:', error);
                await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
            }
        }

    }
}


module.exports = Message;
