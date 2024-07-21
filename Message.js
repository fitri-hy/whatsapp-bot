async function handleMessage(sock, message) {
    const messageText = message.message?.conversation || '';
    const remoteJid = message.key.remoteJid;

    if (messageText) {
        const receivedLog = {
            status: 'Received',
            conversation: messageText,
            timestamp: new Date().toISOString()
        };
        console.log(JSON.stringify(receivedLog));
    }

    if (messageText.startsWith('.bot')) {
		const responseText = 'Hi, I am Bot';
		const sendingLog = {
			status: 'Sending',
			conversation: `${responseText}\n\nTo: ${remoteJid}`,
			timestamp: new Date().toISOString()
		};
		console.log(JSON.stringify(sendingLog));

		try {
			await sock.sendMessage(remoteJid, { text: responseText }, { quoted: message });
		} catch (error) {
			console.error(`Failed to send message to ${remoteJid}:`, error);
		}
	}

}

module.exports = { handleMessage };
