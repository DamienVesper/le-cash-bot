const Discord = require(`discord.js`);
const { config } = require(`../index.js`);
const jsonstore = require(`jsonstore.io`);
const cooldowns = require(`../../databases/cooldowns.json`);
let store = new jsonstore(config.jsonstoreToken);

module.exports.run = async(client, message, args) => {    
    let dailyAmt = 100;
    store.read(`users/${message.author.id}`).then(data => {
        /*if(new Date() - new Date(data.cooldowns.commands.daily) <= (cooldowns.commands.daily * 2))*/ store.write(`users/${message.author.id}/dailyStreak`, data.dailyStreak += 1);
        // else store.write(`users/${message.author.id}/dailyStreak`, 0);

        store.read(`users/${message.author.id}`).then(data => {
            dailyAmt += 25 * data.dailyStreak;

            store.write(`users/${message.author.id}/balance`, data.balance += dailyAmt);
            store.write(`users/${message.author.id}/cooldowns/commands/daily`, new Date());
            
            let sEmbed = new Discord.RichEmbed()
                .setAuthor(`Daily`, message.author.avatarURL)
                .setDescription(`You earned $\`${dailyAmt}\`! You are currently on a a streak of \`${data.dailyStreak}\` days.`)
                .setTimestamp(new Date())
                .setFooter(config.footer);
            return message.channel.send(sEmbed);
        });
    });
}

module.exports.config = {
    name: `daily`
}