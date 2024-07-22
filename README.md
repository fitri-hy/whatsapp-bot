# Whatsapp Bot

### Bulk Message
```
.bulk list
```
```
.bulk create <namegroup> <phone1,phone2,phone3,...> "responseText"

example:
.bulk create group-bulk 681111111111,6282222222222,62833333333 "Hi, This is a bulk message"
```
```
.bulk start <group_name>

example:
.bulk start group-bulk
```

### Custom Message
Go to: `/config/ConfigMessage.json

### App Searching
```
.app <query>

example:
.app whatsapp
```

### Chat GPT
```
.ai <question>

example:
.ai hi
```

### SEO Checker
```
.seo <domain>

example:
.seo i-as.dev
```

### Math
```
.mtk <summation>

example:
.mtk 10+10-10*2/2
```

### Encrypted
```
.md5 <text> - Generates an MD5 hash of the text.
.sha256 <text> - Generates a SHA-256 hash of text.
.sha512 <text> - Generates a SHA-512 hash of the text.
.ripemd160 <text> - Generates a RIPEMD-160 hash of the text.
.blake2 <text> - Generates a BLAKE2 hash of the text.
```

Features will continue to grow over time

## Instalation
```
git clone https://github.com/fitri-hy/whatsapp-bot.git
cd whatsapp-bot
npm install
npm start
```
