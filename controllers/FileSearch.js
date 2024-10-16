const axios = require('axios');
const cheerio = require('cheerio');

async function FileSearch(query, searchType = 'pdf') {
    const fileTypes = {
        pdf: 'filetype:pdf',
        doc: 'filetype:doc',
        docx: 'filetype:docx',
        xls: 'filetype:xls',
        xlsx: 'filetype:xlsx',
        ppt: 'filetype:ppt',
        pptx: 'filetype:pptx',
        txt: 'filetype:txt',
        html: 'filetype:html',
        htm: 'filetype:htm',
        csv: 'filetype:csv',
        rtf: 'filetype:rtf',
        odt: 'filetype:odt',
        ods: 'filetype:ods',
        odp: 'filetype:odp',
        epub: 'filetype:epub',
        zip: 'filetype:zip',
        gz: 'filetype:gz'
    };

    const filetypeQuery = fileTypes[searchType] || '';
    const url = filetypeQuery
        ? `https://www.google.com/search?q=${filetypeQuery}+${encodeURIComponent(query)}`
        : `https://www.google.com/search?q=${encodeURIComponent(query)}`;

    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const results = [];
        
        if (filetypeQuery) {
            $('a').each((i, el) => {
                let href = $(el).attr('href');
                let title = $(el).find('h3').text().trim();

                if (href && href.includes(`.${searchType}`)) {
                    href = href.startsWith('http') ? href : `https://www.google.com${href}`;
                    results.push({
                        url: href,
                        title: title || 'No Title'
                    });
                }
            });
        }

        if (results.length > 0) {
            results.shift();
        }

        return results.length > 0 
            ? results.map(result => `${result.title || 'No Title'}: ${result.url}`).join('\n\n') 
            : 'No results found.';
    } catch (error) {
        console.error(error);
        throw new Error('Error occurred while scraping');
    }
}

module.exports = { FileSearch };
