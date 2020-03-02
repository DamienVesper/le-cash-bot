const Discord = require(`discord.js`);
const { config, client } = require(`../index.js`);
const jsonstore = require(`jsonstore.io`);
const api = require(`../api.js`);
let store = new jsonstore(config.jsonstoreToken);

client.on(`disconnnect`, e => console.error(`${client.user.tag} disconnected from ${config.hostname}.`));