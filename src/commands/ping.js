const Discord = require(`discord.js`);
const Math = require(`math.js`);
const jsonstore = require(`jsonstore.io`);
const { config } = require(`../index.js`);
let store = new jsonstore(config.jsonstoreToken);

module.exports = {
    name: `ping`,
    description: `Ping the bot`,
    aliases: null,
    usage: null
}

module.exports.run = async(client, message, args) => {
    let a = await message.channel.send(`Ping?`); 
    let sEmbed = new Discord.RichEmbed()
      .setColor(0x1e90ff)
      .setAuthor(`Bot Latency`, message.author.avatarURL)
      .setDescription(`
        API Latency: \`${client.ping}ms\`
        Host Latency: \`${a.createdTimestamp - message.createdTimestamp}ms\`
        `)
      .setTimestamp(new Date())
      .setFooter(config.footer);  
    return a.edit(`${message.author}`, sEmbed);  
}