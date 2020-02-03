const Discord = require(`discord.js`);
const { config } = require(`../index.js`);
const moneyAPI = require(`../api/money.js`);
const jsonstore = require(`jsonstore.io`);
let store = new jsonstore(config.jsonstoreToken);

module.exports.run = async(client, message, args) => {
    let profileUser = args[0];
    if(!profileUser) profileUser = message.member;
    else if(message.mentions.members) profileUser = message.mentions.members.first();
    else if(isNaN(parseInt(profileUser))) return message.channel.send(`${message.author} That is an invalid user!`);
    else profileUser = message.guild.members.get(args[0]);

    if(!profileUser) return message.channel.send(`${message.author} That is an invalid user!`);

    store.read(`users/${profileUser.id}`).then(data => {
        if(!data) return message.channel.send(`${message.author} That user doesn't have an account!`);
        let sEmbed = new Discord.RichEmbed()
            .setAuthor(profileUser.user.username, profileUser.user.avatarURL)
            .setDescription(`${profileUser} has $${moneyAPI.standardize(data.balance)}.`)
            .setTimestamp(new Date())
            .setFooter(config.footer);
        message.channel.send(sEmbed);
    });
}

module.exports.config = {
    name: `balance`
}