const Discord = require(`discord.js`);
const Math = require(`math.js`);
const jsonstore = require(`jsonstore.io`);
const { config } = require(`../index.js`);
let store = new jsonstore(config.jsonstoreToken);

const cooldowns = require(`../../databases/cooldowns.json`);

module.exports = {
    name: `daily`,
    description: `Get your daily cash.`,
    aliases: [`claim`],
    usage: null
}

module.exports.run = async(client, message, args) => {
    let dailyAmt = 100;
    store.read(`users/${message.author.id}`).then(data => {
        if(((new Date(data.cooldowns.commands.daily) - new Date()) * -1) <= cooldowns.commands.daily) store.write(`users/${message.author.id}/dailyStreak`, data.dailyStreak += 1);
        else store.write(`users/${message.author.id}/dailyStreak`, 0);

        store.read(`users/${message.author.id}`).then(data => {
            dailyAmt += 25 * data.dailyStreak;

            store.write(`users/${message.author.id}/balance`, data.balance += dailyAmt);
            store.write(`users/${message.author.id}/cooldowns/commands/daily`, new Date());
            
            let sEmbed = new Discord.RichEmbed()
                .setAuthor(`Daily`, message.author.avatarURL)
                .setDescription(`You earned $\`${dailyAmt}\`! You are currently on a streak of \`${data.dailyStreak}\` days.`)
                .setTimestamp(new Date())
                .setFooter(config.footer);
            return message.channel.send(sEmbed);
        });
    });
}