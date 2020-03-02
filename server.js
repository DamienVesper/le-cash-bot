const bot = require(`./src/index.js`); //require(`./discord-bot/shardManager.js`);
const dotenv = require(`dotenv`).config();

const express = require(`express`);
const app = express();

app.get(`/`, (req, res) => res.sendFile(`${__dirname}/views/index.html`));
const serverListener = app.listen(process.env.NODE_SERVER_PORT, () => console.log(`Your app is running on port ${process.env.NODE_SERVER_PORT}.`));