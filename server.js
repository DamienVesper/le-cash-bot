const DiscordBot = require(`./discord-bot/index.js`);
const dotenv = require(`dotenv`).config();

const fs = require(`fs`);
const express = require(`express`);
const app = express();

app.get(`/`, (req, res) => res.sendFile(`${__dirname}/views/index.html`));
app.get(`/ehehehe`, (req, res) => res.send(`aHR0cHM6Ly9kaXNjb3JkLmdnL0RHVDQ4RWQ=`));
const serverListener = app.listen(process.env.NODE_SERVER_PORT, () => console.log(`Your app is running on port ${process.env.NODE_SERVER_PORT}`));