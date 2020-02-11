const Discord = require(`discord.js`);
const { config } = require(`../index.js`);
const moneyAPI = require(`../api/money.js`);
const cleanseAPI = require(`../api/cleanse.js`);
const jsonstore = require(`jsonstore.io`);
let store = new jsonstore(config.jsonstoreToken);

module.exports.run = async(client, message, args) => {
    let lb = [];

    store.read(`users`).then(data => {
        for(let i in data) {
            if(data[i].user && data[i].user.username != `LeCashBot`) {
                lb.push({
                    bal: data[i].balance,
                    dailyStreak: data[i].dailyStreak,
                    hBet: {
                        amount: data[i].highestBet.amount,
                        chance: data[i].highestBet.chance
                    },
                    id: data[i].user.id,
                    messages: data[i].messageCount,
                    username: `${data[i].user.username}#${data[i].user.discriminator}`
                });
            }   
        }
        switch(args[0]) {
            case `bet`: lb.sort((a, b) => (a.hBet.amount <= b.hBet.amount) ? 1 : -1); break;
            case `messages`: lb.sort((a, b) => (a.messages <= b.messages) ? 1 : -1); break;
            case `daily`: lb.sort((a, b) => (a.dailyStreak <= b.dailyStreak) ? 1 : -1); break;
            default: lb.sort((a, b) => (a.bal <= b.bal) ? 1 : -1); break;
        }

        let lbTxt = ``;
        for(let i = 0; i < 10; i++) {
            switch(args[0]) {
                case `bet`: lbTxt += `${i == 0 ? `🥇`: i == 1 ? `🥈`: i == 2 ? `🥉`: `🏅`} - ${lb[i].username} - $${moneyAPI.standardize(lb[i].hBet.amount)} [${lb[i].hBet.chance}%]\n`; break;
                case `cash`: lbTxt += `${i == 0 ? `🥇`: i == 1 ? `🥈`: i == 2 ? `🥉`: `🏅`} - ${lb[i].username} - ${moneyAPI.standardize(lb[i].bal)}\n`; break;
                case `daily`: lbTxt += `${i == 0 ? `🥇`: i == 1 ? `🥈`: i == 2 ? `🥉`: `🏅`} - ${lb[i].username} - ${lb[i].dailyStreak}\n`; break;
                case `messages`: lbTxt += `${i == 0 ? `🥇`: i == 1 ? `🥈`: i == 2 ? `🥉`: `🏅`} - ${lb[i].username} - ${lb[i].messages}\n`; break;
                default: lbTxt = `That is an invalid leaderboard!\nValid leaderboards are bet, cash, daily, or messages.`; break;
            }
        }

        lbTxt = cleanseAPI.discordCleanse(lbTxt);
        let sEmbed = new Discord.RichEmbed()
            .setColor(0x1e90ff)
            .setAuthor(`Global Leaderboard`, message.author.avatarURL)
            .setTimestamp(new Date())
            .setFooter(config.footer);

        let userRank;
        for(let i = 0; i < lb.length; i++) if(lb[i].id == message.author.id) userRank = i;
        if(userRank > 9) {
            switch(args[0]) {
                case `bet`: sEmbed.setDescription(`${lbTxt}\n🎖️ #${userRank + 1} - ${cleanseAPI.discordCleanse(message.author.tag)} - ${moneyAPI.standardize(lb[userRank].hBet.amount)} [${lb[userRank].hBet.chance}%]`); break;
                case `messages`: sEmbed.setDescription(`${lbTxt}\n🎖️ #${userRank + 1} - ${cleanseAPI.discordCleanse(message.author.tag)} - ${lb[userRank].messages}`); break;
                case `daily`: sEmbed.setDescription(`${lbTxt}\n🎖️ #${userRank + 1} - ${cleanseAPI.discordCleanse(message.author.tag)} - ${lb[userRank].dailyStreak}`); break;
                default: sEmbed.setDescription(`${lbTxt}\n🎖️ #${userRank + 1} - ${cleanseAPI.discordCleanse(message.author.tag)} - $${moneyAPI.standardize(lb[userRank].bal)}`); break;
            }
        }
        else sEmbed.setDescription(lbTxt)
        return message.channel.send(sEmbed);
    });
}

module.exports.config = {
    name: `leaderboard`
}