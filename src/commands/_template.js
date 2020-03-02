const Discord = require(`discord.js`);
const Math = require(`math.js`);
const jsonstore = require(`jsonstore.io`);
const { config } = require(`../index.js`);
let store = new jsonstore(config.jsonstoreToken);

module.exports = {
    name: `_template`,
    description: ``,
    aliases: [],
    usage: `<required> [not]`
}

module.exports.run = async(client, message, args) => {}