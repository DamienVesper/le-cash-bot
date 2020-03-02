const Discord = require(`discord.js`);
const { config, client } = require(`../index.js`);
const jsonstore = require(`jsonstore.io`);
const api = require(`../api.js`);
let store = new jsonstore(config.jsonstoreToken);

client.on(`warn`, warning => {
    console.warn(warning)
    client.destroy.then(() => client.login(config.token));
});