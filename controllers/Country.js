const axios = require('axios');

async function Country(countryName) {
    try {
        const response = await axios.get(`https://restcountries.com/v3.1/name/${countryName}`);
        const country = response.data[0];

        let responseText = `*${country.flag} ${country.name.common} (${country.name.official})*\n\n`;
        responseText += `Capital: ${country.capital ? country.capital[0] : 'N/A'}\n`;
        responseText += `Region: ${country.region}\n`;
        responseText += `Subregion: ${country.subregion}\n`;
        responseText += `Population: ${country.population.toLocaleString()}\n`;
        responseText += `Currency: ${country.currencies ? 
            Object.keys(country.currencies).map(key => 
                `${country.currencies[key].name} (${country.currencies[key].symbol})`).join(', ') 
            : 'N/A'}\n`;
        responseText += `Timezones: ${country.timezones ? country.timezones.join(', ') : 'N/A'}\n`;
		responseText += `CCA2: ${country.cca2}\n`;
        responseText += `CCN3: ${country.ccn3}\n`;
        responseText += `CCA3: ${country.cca3}\n`;
        responseText += `CIOC: ${country.cioc}\n`;
        responseText += `Map: [Google Maps](${country.maps.googleMaps})\n`;

        return responseText;
    } catch (error) {
        console.error('Error fetching country details:', error);
        throw new Error('Failed to fetch country details');
    }
}


module.exports = { Country };
