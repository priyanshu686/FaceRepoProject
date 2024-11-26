const fs = require('fs');
const path = require('path');

const pad = (num) => {
    return num < 10 ? '0' + num : num;
};

const padEnd = (str) => {
    return str.padEnd(0, ',');
};

const getTimeStamp = () => {
    const now = new Date();
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())} ${now.toString().split(' ')[0]}`;
};

const logger = (req, res, next) => {
    const ip =((req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip).split('::ffff:')[1] || 'localhost:3000');
    const method =req.method;
    const Url = req.originalUrl;
    const timestamp = getTimeStamp();
    const logHeader = `IP,URL,METHOD,TIMESTAMP`;
    const log = `\n${ip},${Url},${method},${timestamp}`;

    if (!fs.existsSync(path.join(__dirname, '../logs'))) {
        fs.mkdirSync(path.join(__dirname, '../logs'));
    } if (!fs.existsSync(path.join(__dirname, '../logs/access.csv'))) {
        fs.writeFileSync(path.join(__dirname, '../logs/access.csv'), logHeader);
    }
    fs.appendFileSync(path.join(__dirname, '../logs/access.csv'), log);

    next();
};
module.exports = logger;