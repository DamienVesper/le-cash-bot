const Discord = require(`discord.js`);
const { config, client } = require(`../index.js`);
const jsonstore = require(`jsonstore.io`);
const api = require(`../api.js`);
let store = new jsonstore(config.jsonstoreToken);

client.on(`resume`, eNum => console.log(`${client.user.tag} has succesfully reconnected to ${config.hostname} and replayed ${eNum} events.`));