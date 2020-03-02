const Discord = require(`discord.js`);
const Math = require(`math.js`);
const jsonstore = require(`jsonstore.io`);
const { config } = require(`../index.js`);
let store = new jsonstore(config.jsonstoreToken);
const donors = require(`../../databases/donors.json`);

module.exports = {
    name: `donate`,
    description: `Want to donate to the bot>`,
    aliases: null,
    usage: null
}

module.exports.run = async(client, message, args) => {
    let donorText = ``;
    for(let i in donors) {
        donorText +=  `${i} - $${client.api.numbers.standardize(donors[i])}\n`;
    }        

    let sEmbed = new Discord.RichEmbed()
        .setColor(0xffa500)
        .setAuthor(`Donate`, message.author.avatarURL)
        .setDescription(`Want to support the future of this bot? Send money to [this](https://nitrotype.com/racer/mrh110) link.`)
        .addField(`Donors`, donorText)
        .setTimestamp(new Date())
        .setFooter(config.footer);
    return message.channel.send(sEmbed);
}