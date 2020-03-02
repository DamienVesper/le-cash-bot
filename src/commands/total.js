const Discord = require(`discord.js`);
const Math = require(`math.js`);
const jsonstore = require(`jsonstore.io`);
const { config } = require(`../index.js`);
let store = new jsonstore(config.jsonstoreToken);

module.exports = {
    name: `total`,
    description: `View the total cash.`,
    aliases: null,
    usage: null
}

module.exports.run = async(client, message, args) => {
    store.read(`users`).then(data => {
        let totalBal = 0;
        for(let i in data) {
            if(data[i].user && data[i].user.id != client.user.id) totalBal += data[i].balance;
        }
        store.read(`users/${client.user.id}/balance`).then(mBal => {
            let sEmbed = new Discord.RichEmbed()
                .setColor(0x00ff00)
                .setAuthor(message.author.username, message.author.avatarURL)
                .setDescription(`The total balance of all users is \`$${client.api.numbers.standardize(totalBal)}\`.\nThere is currently \`$${client.api.numbers.standardize(mBal)}\` left to give away.`)
                .setTimestamp(new Date())
                .setFooter(config.footer);
            return message.channel.send(sEmbed);
        });
    });
}