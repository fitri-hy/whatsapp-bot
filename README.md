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
Go to: `/utils/MessageUtils.js`

### Settings
Go to: `config/ConfigSettings.json`

## Instalation
```
git clone https://github.com/fitri-hy/whatsapp-bot.git
cd whatsapp-bot
npm install
npm start
```
