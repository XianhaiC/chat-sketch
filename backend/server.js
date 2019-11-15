const express = require('express');
const cors = require('cors');
const router = require('./src/controller');
const app = express();

app.use(router);
app.use(cors());
app.get('/', (req, res) => res.send('Chat sketch API'));
module.exports = app;
