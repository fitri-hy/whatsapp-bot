const axios = require('axios');

async function Surah(surahId) {
    try {
        const response = await axios.get(`https://web-api.qurankemenag.net/quran-ayah?surah=${surahId}`);
        const details = response.data.data;

        let responseText = `Surah: ${details[0].surah.latin} (${details[0].surah.translation})\n\n`;
        details.forEach(ayah => {
            responseText += `No ${ayah.ayah}\n`;
            responseText += `${ayah.arabic}\n`;
            responseText += `${ayah.translation}\n`;
            responseText += `----------------------------------------\n\n`;
        });

        return responseText;
    } catch (error) {
        console.error('Error fetching surah details:', error);
        throw new Error('Failed to fetch surah details');
    }
}

async function SurahDetails(surahId, ayahId) {
    try {
        const response = await axios.get(`https://web-api.qurankemenag.net/quran-ayah?surah=${surahId}`);
        const ayahDetail = response.data.data.find(ayah => ayah.ayah === ayahId);
		
		if (!ayahDetail) {
            return 'Surah Not available';
        }
		
        let responseText = `Surah: ${ayahDetail.surah.latin} (${ayahDetail.surah.translation})\n`;
        responseText += `No ${ayahDetail.ayah}\n`;
        responseText += `${ayahDetail.arabic}\n`;
        responseText += `${ayahDetail.translation}\n`;

        return responseText;
    } catch (error) {
        console.error('Error fetching ayah details:', error);
        throw new Error('Failed to fetch ayah details');
    }
}

module.exports = { Surah, SurahDetails };
