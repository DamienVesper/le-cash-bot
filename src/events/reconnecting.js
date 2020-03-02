const Discord = require(`discord.js`);
const { config, client } = require(`../index.js`);
const jsonstore = require(`jsonstore.io`);
const api = require(`../api.js`);
let store = new jsonstore(config.jsonstoreToken);

client.on(`reconnecting`, () => console.log(`${client.user.tag} is attempting to reconnect to ${config.hostname}.`));