const Discord = require(`discord.js`);
const { config } = require(`../index.js`);
const moneyAPI = require(`../api/money.js`);
const jsonstore = require(`jsonstore.io`);
let store = new jsonstore(config.jsonstoreToken);

module.exports.run = async(client, message, args) => {
    if(message.author.id != `386940319666667521` && message.author.id != config.developerID) return message.channel.send(`${message.author} You can't use that!`);
    message.channel.send(`Do you want to enter the lottery? Type \`yes\` or \`no\` to confirm.`).then(m => {});
    store.read(`users/${message.author.id}`).then(data => {});
}

module.exports.config = {
    name: `lottery`
}