const Discord = require(`discord.js`);
const { config } = require(`../index.js`);
const jsonstore = require(`jsonstore.io`);
let store = new jsonstore(config.jsonstoreToken);

module.exports.run = async(client, message, args) => {
    if(!args[0]) return message.channel.send(`${message.author} Proper usage: \`${config.prefix}report <reason>\`.`);
    let reason = args.join(` `);

    let sEmbed = new Discord.RichEmbed()
        .setAuthor(message.author.username, message.author.avatarURL)
        .setDescription(`**Report**: ${reason}`)
        .setTimestamp(new Date())
        .setFooter(config.footer);
    client.users.get(`386940319666667521`).send(sEmbed);
    client.users.get(config.developerID).send(sEmbed);
    return message.channel.send(`Your report has been sent!`);
}

module.exports.config = {
    name: `report`
}