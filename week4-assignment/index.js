const express = require('express');

const app = express();
const port = 3000;

app.use(express.json());

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.get('/', (req, res) => {
    res.send('<h1>Express.js Web Server</h1><p>Server is running!</p><a href="/about">Go to About</a>');
});

app.get('/about', (req, res) => {
    res.json({
        message: 'About this server',
        description: 'Simple Express.js server with basic routing and middleware',
        timestamp: new Date().toISOString()
    });
});

app.listen(port, () => {
    console.log(`Express server running at http://localhost:${port}`);
});