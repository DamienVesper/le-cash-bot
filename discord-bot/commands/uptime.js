const Discord = require(`discord.js`);
const { config } = require(`../index.js`);
const moneyAPI = require(`../api/money.js`);
const jsonstore = require(`jsonstore.io`);
let store = new jsonstore(config.jsonstoreToken);

module.exports.run = async(client, message, args) => {
    let sEmbed = new Discord.RichEmbed()
        .setColor(0x1e90ff)
        .setAuthor(`Bot Uptime`, message.author.avatarURL)
        .setDescription(`
Days: \`${Math.floor(client.uptime / (1000 * 60 * 60 * 24))}\`
Hours: \`${Math.floor(client.uptime / (1000 * 60 * 60) % 24)}\`
Minutes: \`${Math.floor(client.uptime / (1000 * 60) % 60)}\`
Seconds: \`${Math.floor((client.uptime / 1000) % 60)}\`
Milliseconds: \`${Math.floor(client.uptime % 1000)}\`
`)
        .setTimestamp(new Date())
        .setFooter(config.footer);
    return message.channel.send(sEmbed);
}

module.exports.config = {
    name: `uptime`
}