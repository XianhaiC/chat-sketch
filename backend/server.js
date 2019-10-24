const express = require('express');
const router = require('./src/controller');
const app = express();

app.use(router);
app.get('/', (req, res) => res.send('Chat sketch API'));
module.exports = app;
