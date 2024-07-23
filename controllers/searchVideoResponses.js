const puppeteer = require('puppeteer');

async function searchVideo(query) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.google.com/search?q=video+' + encodeURIComponent(query));

    await page.waitForSelector('h3');

    const videoResults = await page.evaluate(() => {
        const results = Array.from(document.querySelectorAll('h3')).map(h3 => {
            const a = h3.parentElement;
            if (a && a.tagName === 'A') {
                const title = h3.innerText;
                const href = a.href;
                return { title, href };
            }
            return null;
        }).filter(result => result && (result.href.includes('youtube.com/watch') || result.href.includes('vimeo.com')));
        return results;
    });

    await browser.close();
    return videoResults;
}

async function handleSearchVideo(sock, message) {
    const messageText = message.message.conversation;
    const remoteJid = message.key.remoteJid;

    if (messageText.startsWith('.searchvideo')) {
        const query = messageText.replace('.searchvideo ', '');
        const videoResults = await searchVideo(query);

        const responseText = videoResults.length > 0
            ? videoResults.map(result => `${result.title}\n${result.href}`).join('\n\n')
            : 'No video URLs found.';
        
        console.log(`Replying to ${remoteJid} with "${responseText}"`);
        await sock.sendMessage(remoteJid, { text: responseText }, { quoted: message });
    }
}

module.exports = handleSearchVideo;
