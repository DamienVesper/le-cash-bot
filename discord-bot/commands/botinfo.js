const Discord = require(`discord.js`);
const { config } = require(`../index.js`);
const jsonstore = require(`jsonstore.io`);
let store = new jsonstore(config.jsonstoreToken);

module.exports.run = async(client, message, args) => {
    const donorText = await require(`../api/getDonors.js`);
    let sEmbed = new Discord.RichEmbed()
        .setColor(`ff0000`)
        .setAuthor(`Bot Info`, message.author.avatarURL)
        .addField(`\u200B`, `
Author: <@${config.developerID}>
Creation Date: June 7, 2019
Bot: ${client.user}
Prefix: \`${config.prefix}\`
`)
        .addField(`Contributors`, `
\`DamienVesper\`, \`Spondulix\`, \`SweatySaturdays\`
Want to Volunteer? Fill out [this](https://forms.gle/rLC4dZhxZFXcZjLd9/) form.
`)
        .addField(`API`, `
Latency: ${client.ping} ms
Uptime: ${client.uptime / 1000} seconds
`)
        .addField(`Donors`, donorText)
        .setTimestamp(new Date())
        .setFooter(config.footer);
    message.channel.send(sEmbed);
}

module.exports.config = {
    name: `botinfo`
}