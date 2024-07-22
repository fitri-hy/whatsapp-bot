async function handleExample(sock, message) {
    const messageText = message.message.conversation;
    const remoteJid = message.key.remoteJid;

    if (messageText.startsWith('.custom')) {
		const responseText = 'Hi, I am Bot custom';
		console.log(Replying to ${remoteJid} with "${responseText}");
		await sock.sendMessage(remoteJid, { text: responseText }, { quoted: message });
	}
}

module.exports = handleExample;
