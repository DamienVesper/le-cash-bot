const Discord = require(`discord.js`);
const { config } = require(`../index.js`);
const jsonstore = require(`jsonstore.io`);
let store = new jsonstore(config.jsonstoreToken);

module.exports.run = async(client, message, args) => {
    const donorText = await require(`../api/getDonors.js`);
    let sEmbed = new Discord.RichEmbed()
        .setColor(0xffa500)
        .setAuthor(`Donate`, message.author.avatarURL)
        .setDescription(`Want to support the future of this bot? Send money to [this](https://nitrotype.com/racer/mrh110) link.`)
        .addField(`Donors`, donorText)
        .setTimestamp(new Date())
        .setFooter(config.footer);
    return message.channel.send(sEmbed);
}

module.exports.config = {
    name: `donate`
}