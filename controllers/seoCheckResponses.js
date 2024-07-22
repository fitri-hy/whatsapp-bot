const axios = require('axios');

async function handleSeoCheck(sock, message) {
    const messageText = message.message.conversation;
    const remoteJid = message.key.remoteJid;

    if (messageText.startsWith('.seo ')) {
        const domain = messageText.slice(5).trim();

        async function getResponse(domain) {
            try {
                const response = await axios.get(`https://i-as.dev/api/check-seo/${encodeURIComponent(domain)}`);
                const seoData = response.data;

                const formattedResponse = `
*SEO Success Rate*: ${seoData.seoSuccessRate}
*Title*: ${seoData.title}
*Meta Description*: ${seoData.metaDescription}
*Meta Keywords*: ${seoData.metaKeywords}
*OG Title*: ${seoData.ogTitle}
*OG Description*: ${seoData.ogDescription}
*OG Image*: ${seoData.ogImage}
*Canonical URL*: ${seoData.canonicalUrl}
*Indexable*: ${seoData.isIndexable ? 'Yes' : 'No'}
`;

                return formattedResponse;
            } catch (error) {
                console.error('Error fetching SEO check response:', error);
                return 'Sorry, I could not get a response from the SEO check.';
            }
        }

        const apiResponse = await getResponse(domain);

        console.log(`Replying to ${remoteJid} with "${apiResponse}"`);
        await sock.sendMessage(remoteJid, { text: apiResponse }, { quoted: message });
    }
}

module.exports = handleSeoCheck;
