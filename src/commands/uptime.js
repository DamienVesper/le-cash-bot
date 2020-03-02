const Discord = require(`discord.js`);
const Math = require(`math.js`);
const jsonstore = require(`jsonstore.io`);
const { config } = require(`../index.js`);
let store = new jsonstore(config.jsonstoreToken);

module.exports = {
    name: `uptime`,
    description: `View bot uptime.`,
    aliases: null,
    usage: null
}

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