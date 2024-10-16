const axios = require('axios');

async function Weather(cityName) {
  const weatherUrl = `https://wttr.in/${cityName}?format=%t|%C|%w|%h&lang=id&m`;

  try {
    const response = await axios.get(weatherUrl);
    const weatherData = response.data;

    const weatherParts = weatherData.split('|');
    const temperature = weatherParts[0];
    const condition = weatherParts[1];
    const wind = weatherParts[2];
    const humidity = weatherParts[3];

    const weatherJson = {
      temperature: temperature.trim(),
      condition: condition.trim(),
      wind: wind.trim(),
      humidity: humidity.trim()
    };

    return weatherJson;
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw new Error('Tidak dapat mengambil data cuaca.');
  }
}

module.exports = { Weather  };
