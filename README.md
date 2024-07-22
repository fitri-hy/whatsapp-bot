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

Features will continue to grow over time

## Instalation
```
git clone https://github.com/fitri-hy/whatsapp-bot.git
cd whatsapp-bot
npm install
npm start
```
