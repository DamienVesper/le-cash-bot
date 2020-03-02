const Discord = require(`discord.js`);
const { config, client } = require(`../index.js`);
const jsonstore = require(`jsonstore.io`);
let store = new jsonstore(config.jsonstoreToken);

client.on(``, placeholder => {});