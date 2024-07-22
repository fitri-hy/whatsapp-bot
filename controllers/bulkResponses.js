const fs = require('fs');
const path = require('path');

const configMessageBulkPath = path.join(__dirname, '../config/ConfigMessageBulk.json');
const configSettingsPath = path.join(__dirname, '../config/ConfigSettings.json');

const bulkConfig = JSON.parse(fs.readFileSync(configMessageBulkPath, 'utf8'));
const settings = JSON.parse(fs.readFileSync(configSettingsPath, 'utf8'));
const bulkSettings = settings.bulksetting;

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function handleBulkResponses(sock, message) {
    const messageText = message.message.conversation;
    const remoteJid = message.key.remoteJid;

    if (messageText.startsWith('.bulk start ')) {
        const parts = messageText.split(' ');

        if (parts.length < 3) {
            const errorMessage = 'Invalid command format. Usage: .bulk start <group_name>';
            console.error(errorMessage);
            await sock.sendMessage(remoteJid, { text: errorMessage }, { quoted: message });
        } else {
            const groupName = parts[2];

            if (bulkConfig[groupName]) {
                const group = bulkConfig[groupName];
                console.log(`Sending bulk message to ${groupName}: "${group.message.responseText}"`);
                for (const recipient of group.recipients) {
                    try {
                        await sock.sendMessage(recipient, { text: group.message.responseText });
                        console.log(`Bulk message sent to ${recipient}`);
                        await delay(bulkSettings.delayMs);
                    } catch (error) {
                        console.error(`Failed to send bulk message to ${recipient}:`, error);
                    }
                }
            } else {
                const errorMessage = `Group "${groupName}" not found. Please check the group name and try again.`;
                console.error(errorMessage);
                await sock.sendMessage(remoteJid, { text: errorMessage }, { quoted: message });
            }
        }
    }

    if (messageText === '.bulk list') {
        const groupNames = Object.keys(bulkConfig);
        if (groupNames.length > 0) {
            const listMessage = `Available groups:\n\n${groupNames.join('\n')}`;
            console.log(`Sending group list to ${remoteJid}`);
            await sock.sendMessage(remoteJid, { text: listMessage }, { quoted: message });
        } else {
            const noGroupsMessage = 'No groups found in the bulk configuration.';
            console.log(noGroupsMessage);
            await sock.sendMessage(remoteJid, { text: noGroupsMessage }, { quoted: message });
        }
    }

    if (messageText.startsWith('.bulk create ')) {
        const parts = messageText.split(' ');

        if (parts.length < 4) {
            const errorMessage = 'Invalid command format. Usage: .bulk create <namegroup> <phone1,phone2,phone3,...> <responseText>';
            console.error(errorMessage);
            await sock.sendMessage(remoteJid, { text: errorMessage }, { quoted: message });
        } else {
            const groupName = parts[2];
            const phones = parts[3];
            const responseText = parts.slice(4).join(' ');
            const phoneList = phones.split(',').map(phone => phone.trim());

            const recipients = phoneList.map(phone => `${phone}@s.whatsapp.net`);

            if (bulkConfig[groupName]) {
                const errorMessage = `Group "${groupName}" already exists. Please choose a different name.`;
                console.error(errorMessage);
                await sock.sendMessage(remoteJid, { text: errorMessage }, { quoted: message });
            } else {
                bulkConfig[groupName] = {
                    recipients: recipients,
                    message: {
                        responseText: responseText
                    }
                };

                fs.writeFileSync(configMessageBulkPath, JSON.stringify(bulkConfig, null, 2), 'utf8');

                const successMessage = `Group "${groupName}" created successfully with ${recipients.length} recipients and response text.`;
                console.log(successMessage);
                await sock.sendMessage(remoteJid, { text: successMessage }, { quoted: message });
            }
        }
    }
}

module.exports = handleBulkResponses;
