const axios = require('axios');
const cheerio = require('cheerio');

async function DetikNews(query) {
  const response = await axios.get(`https://www.detik.com/search/searchall?query=${encodeURIComponent(query)}`);
  const $ = cheerio.load(response.data);
  const articles = [];

  $('article.list-content__item').each((index, element) => {
    if (index < 10) {
      const title = $(element).find('.media__title a').text().trim();
      const url = $(element).find('.media__title a').attr('href');

      articles.push({ title, url });
    }
  });

  return articles;
};

const DetikViral = async () => {
  const response = await axios.get('https://www.detik.com/terpopuler');
  const $ = cheerio.load(response.data);
  const articles = [];

  $('article.list-content__item').each((index, element) => {
    if (index < 10) {
      const title = $(element).find('.media__title a').text().trim();
      const url = $(element).find('.media__title a').attr('href');

      articles.push({ title, url });
    }
  });

  return articles;
};

const DetikLatest = async () => {
  const response = await axios.get('https://www.detik.com/');
  const $ = cheerio.load(response.data);
  const articles = [];

  $('article.list-content__item').each((index, element) => {
    if (index < 10) {
      const title = $(element).find('.media__title a').text().trim();
      const url = $(element).find('.media__title a').attr('href');

      articles.push({ title, url });
    }
  });

  return articles;
};

module.exports = { DetikNews, DetikViral, DetikLatest };
