const axios = require('axios');
const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '../config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

function getSimilarityScore(title, query) {
    const lowerTitle = title.toLowerCase();
    const lowerQuery = query.toLowerCase();
    return lowerTitle.includes(lowerQuery) ? 1 : 0;
}

async function AnimeVideo(query) {
    try {
        const searchResponse = await axios.get(`${config.ANIME_API}/api/search?s=${query}`);
        const results = searchResponse.data.results;

        if (!results || results.length === 0) {
            throw new Error('No results found.');
        }

        let bestMatch = null;
        let bestScore = -1;

        for (const result of results) {
            const score = getSimilarityScore(result.title, query);
            if (score > bestScore) {
                bestScore = score;
                bestMatch = result;
            }
        }

        if (!bestMatch) {
            throw new Error('No matching results found.');
        }

        const slug = bestMatch.url.split('/').slice(-2, -1)[0];
        const detailResponse = await axios.get(`${config.ANIME_API}/api/detail/${slug}`);
        const detailData = detailResponse.data;

        const videoUrls = [];
        const episodes = [];
        
		const animeImgUrl = detailData.result.image || '../upload/default.jpg';

        for (const episode of detailData.result.episodes) {
            const episodeSlug = episode.epUrl.split('/').slice(-2, -1)[0];
            const episodeResponse = await axios.get(`${config.ANIME_API}/api/episode/${episodeSlug}`);
            const videoUrl = episodeResponse.data.result.videoUrl;

            if (videoUrl) {
                videoUrls.push(videoUrl);
            }

            episodes.push({
                epNo: episode.epNo,
                epTitle: episode.epTitle,
                epDate: episode.epDate,
                epUrl: episode.epUrl,
                videoUrl
            });
        }

        return {
            title: detailData.result.title,
            videoUrls,
            episodes,
            animeImgUrl,
        };

    } catch (error) {
        throw new Error(`An error occurred while searching for video URLs: ${error.message}`);
    }
}

async function downloadImage(url, outputPath) {
    const writer = fs.createWriteStream(outputPath);

    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

module.exports = { AnimeVideo, downloadImage };
