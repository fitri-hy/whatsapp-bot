const axios = require('axios');
const cheerio = require('cheerio');

async function CheckSEO(domain) {
    try {
        const url = `https://${domain}`;
        
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const title = $('title').text().trim() || 'Not Available';
        const metaDescription = $('meta[name="description"]').attr('content') || 'Not Available';
        const metaKeywords = $('meta[name="keywords"]').attr('content') || 'Not Available';
        const ogTitle = $('meta[property="og:title"]').attr('content') || 'Not Available';
        const ogDescription = $('meta[property="og:description"]').attr('content') || 'Not Available';
        const ogImage = $('meta[property="og:image"]').attr('content') || 'Not Available';
        const canonicalUrl = $('link[rel="canonical"]').attr('href') || 'Not Available';

        const metaRobots = $('meta[name="robots"]').attr('content') || 'Not Available';
        const isIndexable = !(metaRobots.includes('noindex'));

        let totalCriteria = 7;
        let totalCriteriaMet = 0;

        if (title !== 'Not Available') totalCriteriaMet++;
        if (metaDescription !== 'Not Available') totalCriteriaMet++;
        if (metaKeywords !== 'Not Available') totalCriteriaMet++;
        if (ogTitle !== 'Not Available') totalCriteriaMet++;
        if (ogDescription !== 'Not Available') totalCriteriaMet++;
        if (ogImage !== 'Not Available') totalCriteriaMet++;
        if (canonicalUrl !== 'Not Available' && isIndexable) totalCriteriaMet++;

        let seoSuccessRate = ((totalCriteriaMet / totalCriteria) * 100).toFixed(2) + ' %';

        return {
            seoSuccessRate,
            title,
            metaDescription,
            metaKeywords,
            ogTitle,
            ogDescription,
            ogImage,
            canonicalUrl,
            isIndexable
        };
    } catch (error) {
        console.error('Error fetching SEO data:', error);
        throw new Error('Failed to fetch SEO data or domain not available');
    }
}

module.exports = { CheckSEO };
