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
    else profileUser = await message.guild.members.get(profileUser);

    if(!profileUser) return message.channel.send(`${message.author} That is an invalid user!`);

    store.read(`users/${profileUser.id}`).then(data => {
        if(!data) return message.channel.send(`${message.author} That user doesn't have an account!`);
        let sEmbed = new Discord.RichEmbed()
            .setAuthor(profileUser.user.username, profileUser.user.avatarURL)
            .setDescription(`
Balance: $${moneyAPI.standardize(data.balance)}
Daily Streak: ${data.dailyStreak}
Messages Sent: ${data.messageCount}
NT Account: View [here](${data.ntAccount}).
Highest Bet: $${moneyAPI.standardize(data.highestBet.amount)} (Chance: ${data.highestBet.chance}%)
`)
            .setTimestamp(new Date())
            .setFooter(config.footer);
        message.channel.send(sEmbed);
    });
}

module.exports.config = {
    name: `profile`
}