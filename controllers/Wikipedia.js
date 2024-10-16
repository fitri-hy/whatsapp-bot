const axios = require('axios');

async function WikipediaAI(query, sock, chatId, msg) {
    await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });

    try {
        const wikiApiUrl = `https://id.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&utf8=1&origin=*`;
        const response = await axios.get(wikiApiUrl);
        const searchResults = response.data.query.search;

        if (searchResults.length > 0) {
            const result = searchResults[0];
           const responseMessage = `*${result.title}*\n\n${result.snippet.replace(/<[^>]+>/g, '')}...\n\nBaca lebih lanjut di: https://id.wikipedia.org/wiki/${encodeURIComponent(result.title)}`;
            console.log(`Response: ${responseMessage}`);
            return responseMessage;
        } else {
            const responseMessage = "No results found.";
            console.log(`Response: ${responseMessage}`);
            return responseMessage;
        }
    } catch (error) {
        await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
    }
}

async function WikipediaSearch(query, sock, chatId, msg) {
    await sock.sendMessage(chatId, { react: { text: "⌛", key: msg.key } });

    try {
        const wikiApiUrl = `https://id.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=10&format=json&utf8=1&origin=*`;
        const response = await axios.get(wikiApiUrl);
        const searchResults = response.data.query.search;

        if (searchResults.length > 0) {
            let responseMessage = "Hasil pencarian:\n\n";
            
            for (const result of searchResults) {
                const title = result.title;
                const snippet = result.snippet.replace(/<[^>]+>/g, '');
                responseMessage += `*${title}*\n${snippet}...\nBaca lebih lanjut di: https://id.wikipedia.org/wiki/${encodeURIComponent(title)}\n\n`;
            }

            console.log(`Response: ${responseMessage}`);
            return responseMessage;
        } else {
            const responseMessage = "No results found.";
            console.log(`Response: ${responseMessage}`);
            return responseMessage;
        }
    } catch (error) {
        await sock.sendMessage(chatId, { react: { text: "❌", key: msg.key } });
    }
}

module.exports = { WikipediaAI, WikipediaSearch };
