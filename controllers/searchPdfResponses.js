const puppeteer = require('puppeteer');

async function searchPDF(query) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.google.com/search?q=filetype:pdf+' + encodeURIComponent(query));

    await page.waitForSelector('h3');

    const pdfResults = await page.evaluate(() => {
        const results = Array.from(document.querySelectorAll('h3')).map(h3 => {
            const a = h3.parentElement;
            if (a && a.tagName === 'A') {
                const title = h3.innerText;
                const href = a.href;
                return { title, href };
            }
            return null;
        }).filter(result => result && result.href.endsWith('.pdf'));
        return results;
    });

    await browser.close();
    return pdfResults;
}

async function handleSearchPDF(sock, message) {
    const messageText = message.message.conversation;
    const remoteJid = message.key.remoteJid;

    if (messageText.startsWith('.searchpdf')) {
        const query = messageText.replace('.searchpdf ', '');
        const pdfResults = await searchPDF(query);

        const responseText = pdfResults.length > 0
            ? pdfResults.map(result => `${result.title}\n${result.href}`).join('\n\n')
            : 'No PDF files found.';
        
        console.log(`Replying to ${remoteJid} with "${responseText}"`);
        await sock.sendMessage(remoteJid, { text: responseText }, { quoted: message });
    }
}

module.exports = handleSearchPDF;
