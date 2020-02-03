const Discord = require(`discord.js`);
const { config } = require(`../index.js`);
const jsonstore = require(`jsonstore.io`);
let store = new jsonstore(config.jsonstoreToken);

module.exports.run = async(client, message, args) => {
    let sEmbed = new Discord.RichEmbed()
        .setAuthor(`Current Event`, message.author.avatarURL)
        .setColor(0xFF8300)
        .setDescription(``)
        .addField(`Started`, config.event.startDate, true)
        .addField(`Perks`, `${config.event.multiplier}x cash per message.`)
        .setTimestamp(new Date())
        .setFooter(config.footer);
    return message.channel.send(sEmbed);
}

module.exports.config = {
    name: `event`
}