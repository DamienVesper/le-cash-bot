const Discord = require(`discord.js`);
const Math = require(`math.js`);
const jsonstore = require(`jsonstore.io`);
const { config } = require(`../index.js`);
let store = new jsonstore(config.jsonstoreToken);

module.exports = {
    name: `botinfo`,
    description: `View information of the Discord bot.`,
    aliases: [`info`],
    usage: null
}

module.exports.run = async(client, message, args) => {
    let contribTxt = ``;
    for(let i = 0; i < config.perms.developers.length; i++) {
        console.log(contribTxt);
        contribTxt += `<@${config.perms.developers[i]}>, `;
    }
    contribTxt = contribTxt.slice(0, contribTxt.length - 2);
    contribTxt = `\`DamienVesper\`, \`Spondulix\`, \`SweatySaturdays\`.`;
    
    let sEmbed = new Discord.RichEmbed()
        .setColor(`ff0000`)
        .setAuthor(`Bot Info`, message.author.avatarURL)
        .addField(`\u200B`, `
        Author: <@${config.perms.developers[0]}>
        Creation Date: \`June 7, 2019\`.
        Bot: ${client.user}
        Prefix: \`${config.prefix}\`
        `)
        .addField(`Contributors`, `
        ${contribTxt}
        Want to Volunteer? Fill out [this](https://forms.gle/rLC4dZhxZFXcZjLd9/) form.
        `)
        .addField(`Stats`, `
        Latency: \`${client.ping}\` ms
        Uptime: \`${client.uptime / 1000}\` seconds
        `)
        .addField(`Donors`, `Use \`${config.prefix}donate\` to view donators.`)
        .setTimestamp(new Date())
        .setFooter(config.footer);
    return message.channel.send(sEmbed);
}