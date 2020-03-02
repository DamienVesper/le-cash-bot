const Discord = require(`discord.js`);
const Math = require(`math.js`);
const jsonstore = require(`jsonstore.io`);
const { config } = require(`../index.js`);
let store = new jsonstore(config.jsonstoreToken);

module.exports = {
    name: `event`,
    description: `View the current event.`,
    aliases: null,
    usage: null
}

module.exports.run = async(client, message, args) => {
    let sEmbed = new Discord.RichEmbed()
        .setAuthor(`Current Event`, message.author.avatarURL)
        .setColor(0xFF8300)
        .setDescription(`
            Started: ${config.event.startDate}
            Perks: ${config.event.multiplier}x cash per message.
        `)
        .setTimestamp(new Date())
        .setFooter(config.footer);
    return message.channel.send(sEmbed);
}