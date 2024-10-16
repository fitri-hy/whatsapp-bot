const axios = require('axios');

async function Translate(text, targetLang) {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    
    const response = await axios.get(url);
    
    if (response.data && response.data[0] && response.data[0][0] && response.data[0][0][0]) {
        return response.data[0][0][0];
    } else {
        throw new Error('Translation failed');
    }
}

module.exports = { Translate };
