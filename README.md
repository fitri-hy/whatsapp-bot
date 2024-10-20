<img src="./upload/ss.jpg">

# Whatsapp Bot

## Support

- Windows
- Linux
- Termux

## Feature
- Self Bot (True/False) Command `config.json`

### Main Command

|Windows|Linux| Termux | Command      			|  Deskription      |
|-------|-----|--------|-----------------------|-------------------|
|✅|✅|✅|.gemini-ai				|To use Gemini AI, example: `.gemini hello`|
|✅|✅|✅|.gemini-img			|Analyze the quoted image: example quote image `.gemini-img What is this picture?`|
|✅|✅|❌|.sticker       		|Convert images into stickers, example: quote image `.sticker`|
|✅|✅|✅|.to-voice				|Convert text to voice, example: `.to-voice hello words`|
|✅|✅|✅|.wiki-ai				|Get wiki content based on a query, example: `.wiki-ai kucing`|
|✅|✅|✅|.wiki-search			|Get a list of wiki contents based on a query, example: `.wiki-search kucing`|
|✅|✅|✅|.wiki-img				|Get Images from wiki based on query, example: `.wiki-image kucing`|
|✅|✅|✅|.weather				|Get weather data based on city name, example: `.weather jakarta`|
|✅|✅|✅|.translate				|Translate into various languages, example: `.translate-en apa kabar`|
|✅|✅|✅|.surah					|Get the entire surah, example: `.surah 1`|
|✅|✅|✅|.surah-detail			|Get a specific verse from a surah, example: `.surah 1:4`|
|✅|✅|✅|.country				|Get country information, example: `.country indonesia`|
|✅|✅|✅|.seo					|Check SEO status by domain, example: `.seo youtube.com`|
|✅|✅|✅|.words					|Counting words, example: `.words hello words`|
|✅|✅|✅|.mtk					|Multi math addition, example: `.mtk 1-1+1*1:1`|
|✅|✅|✅|.qrcode				|Generate QRcode Image, example: `.qrcode hello words`|
|✅|✅|✅|.aes-enc   			|Encrypts string to AES, example `.aes-enc hello words`|
|✅|✅|✅|.aes-dec   			|Dencrypts string to AES, example `.aes-dec fb3a838c0081abd85717ffdcc79f8edb`|
|✅|✅|✅|.camellia-enc   		|Encrypts string to Camellia, example `.camellia-enc hello words`|
|✅|✅|✅|.camellia-dec   		|Dencrypts string to Camellia, example `.camellia-dec 5afe9e0176eaf2242c4aad209127796e`|
|✅|✅|✅|.sha   				|Encrypts string to SHA, example `.sha hello words`|
|✅|✅|✅|.md5   				|Encrypts string to MD5, example `.md5 hello words`|
|✅|✅|✅|.ripemd   				|Encrypts string to Ripemd, example `.ripemd hello words`|
|✅|✅|✅|.bcrypt   				|Encrypts string to Bcrypt, example `.bcrypt hello words`|
|✅|✅|❌|.ytdl-mp4   			|Convert YouTube video URL to MP4, example `.ytdl-mp4 url`|
|✅|✅|❌|.ytdl-mp3   			|Convert YouTube video URL to MP3, example `.ytdl-mp3 url`|
|✅|✅|❌|.fbdl-mp4   			|Convert Facebook video URL to MP4, example `.fbdl-mp4 url`|
|✅|✅|❌|.fbdl-mp3   			|Convert Facebook video URL to MP3, example `.fbdl-mp3 url`|
|✅|✅|❌|.twdl-mp4   			|Convert Twitter / X video URL to MP4, example `.twdl-mp4 url`|
|✅|✅|❌|.twdl-mp3   			|Convert Twitter / X video URL to MP3, example `.twdl-mp3 url`|
|✅|✅|❌|.igdl-mp4   			|Convert Instagram video URL to MP4, example `.igdl-mp4 url`|
|✅|✅|❌|.igdl-mp3   			|Convert Instagram video URL to MP3, example `.igdl-mp3 url`|
|✅|✅|❌|.tkdl-mp4   			|Convert Tiktok video URL to MP4, example `.tkdl-mp4 url`|
|✅|✅|❌|.tkdl-mp3   			|Convert Tiktok video URL to MP3, example `.tkdl-mp3 url`|
|✅|✅|❌|.vmdl-mp4   			|Convert Vimeo video URL to MP4, example `.vmdl-mp4 url`|
|✅|✅|❌|.vmdl-mp3   			|Convert Vimeo video URL to MP3, example `.vmdl-mp3 url`|
|✅|✅|❌|.ssweb   				|Get a screenshot web of the domain, example `.ssweb domain`|
|✅|✅|❌|.ssmobile   			|Get a screenshot mobile of the domain, example `.ssmobile domain`|
|✅|✅|✅|.detik-search			|Get articles from search, example `.detik-search indonesia|
|✅|✅|✅|.detik-viral			|Get the viral articles, example `.detik-viral`|
|✅|✅|✅|.detik-news   			|Get the latest articles, example `.detik-news`|
|✅|✅|✅|.anime   				|Get anime streaming, example `.anime isekai`|
|✅|✅|✅|.github   				|Get github username account information, example `.github fitri-hy`|
|✅|✅|✅|.{file-type}			|Generate QRcode Image, example: `.pdf javascript`|
|-|-|-|**News Feature**			|Comming Soon ...|

**{File-Type} Support**
```
.pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt, .html, .htm, .csv, .rtf, .odt, .ods, .odp, .epub, .zip, .gz
```
### Group Command

|Windows|Linux| Termux | Command      			|  Deskription      |
|-------|-----|--------|-----------------------|-------------------|
|✅|✅|✅|.add               |Adding a new member in group, example: `.add 628xxxxx`|
|✅|✅|✅|.kick              |Kicking members of the group, example: `.kick @mention`|
|✅|✅|✅|.promote           |Promote members in admin group, example: `.promote @mention`|
|✅|✅|✅|.demote            |Demote admins in group members, example: `.demote @mention`|
|✅|✅|✅|.chat-close        |Only admins can send messages in groups|
|✅|✅|✅|.chat-open         |Everyone can send messages in the group|
|✅|✅|✅|.antilink-true     |Enable deleting messages containing links in group|
|✅|✅|✅|.antilink-false    |Disables deleting messages containing links in groups|
|✅|✅|✅|.badwords-true     |Enable deleting messages containing badwords in group|
|✅|✅|✅|.badwords-false    |Disables deleting messages containing badwords in groups|
|✅|✅|✅|.self-false    	|Enable Bot "Main Commands" for all users except yourself|
|✅|✅|✅|.self-true		    |Enable Bot "Main Command" for yourself|

## Instalation

Please visit the [AI Studio](https://aistudio.google.com) site to get the gemini apikey, Then configure in `config.json`

### Windows

- Install Node.js [Download](https://nodejs.org/id)
- Clone Repository
```
git clone https://github.com/fitri-hy/whatsapp-bot.git
cd whatsapp-bot
```
- Run Bot
```
npm start
```

### Linux

- Install Node.js
```
sudo apt update
sudo apt install nodejs npm
```
- Clone Repository
```
git clone https://github.com/fitri-hy/whatsapp-bot.git
cd whatsapp-bot
```
- Run Bot
```
npm start
```

### Termux

- Install Node.js
```
pkg update
pkg install nodejs git
```
- Clone Repository
```
git clone https://github.com/fitri-hy/whatsapp-bot.git
cd whatsapp-bot
```
- Run Bot
```
npm start
```

Don't forget to Fork and give me a star
