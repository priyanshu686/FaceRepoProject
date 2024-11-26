const express = require('express');
const compression = require('compression');
const path = require('path');

const app = express();

app.use(compression());
app.use(express.static(path.join(__dirname, 'build')));
app.use((req, res, next) => {
    console.log('Request:', req.url);
    next();
});

app.listen(process.env.PORT, () => {
    console.clear();
    console.log('Server is running on port 8080');
});