const Discord = require(`discord.js`);
const Math = require(`math.js`);
const jsonstore = require(`jsonstore.io`);
const { config } = require(`../index.js`);
let store = new jsonstore(config.jsonstoreToken);

module.exports = {
    name: `leaderboard`,
    description: `View user leaderboards.`,
    aliases: [`lb`, `lbs`, `leaderboards`],
    usage: `[type]`
}

module.exports.run = async(client, message, args) => {
    store.read(`users`).then(data => {
        let lb = [];
        for(let i in data) {
            if(data[i].user && data[i].user.username != `LeCashBot`) {
                // let discProc = client.users.get(data[i].user.id);
                if(/*discProc &&*/ !data[i].banned) {
                  lb.push({
                        bal: data[i].balance,
                        dailyStreak: data[i].dailyStreak,
                        hBet: {
                            amount: data[i].highestBet.amount,
                            chance: data[i].highestBet.chance
                        },
                        id: data[i].user.id,
                        messages: data[i].messageCount,
                        username: data[i].user.name
                    });
                }
            }   
        }
        switch(args[0]) {
            case `bet`: lb.sort((a, b) => (a.hBet.amount <= b.hBet.amount) ? 1 : -1); break;
            case `messages`: lb.sort((a, b) => (a.messages <= b.messages) ? 1 : -1); break;
            case `daily`: lb.sort((a, b) => (a.dailyStreak <= b.dailyStreak) ? 1 : -1); break;
            case `cash`: lb.sort((a, b) => (a.bal <= b.bal) ? 1 : -1); break;
        }

        let lbTxt = ``;
        for(let i = 0; i < (lb.length < 10 ? lb.length: 10); i++) {
            switch(args[0]) {
                case `bet`: console.log(lb[i].username); lbTxt += `${i == 0 ? `🥇`: i == 1 ? `🥈`: i == 2 ? `🥉`: `🏅`} - ${lb[i].username} - $${client.api.numbers.standardize(lb[i].hBet.amount)} [${lb[i].hBet.chance}%]\n`; break;
                case `cash`: lbTxt += `${i == 0 ? `🥇`: i == 1 ? `🥈`: i == 2 ? `🥉`: `🏅`} - ${lb[i].username} - $${lb[i].bal}\n`; break;
                case `daily`: lbTxt += `${i == 0 ? `🥇`: i == 1 ? `🥈`: i == 2 ? `🥉`: `🏅`} - ${lb[i].username} - ${lb[i].dailyStreak}\n`; break;
                case `messages`: lbTxt += `${i == 0 ? `🥇`: i == 1 ? `🥈`: i == 2 ? `🥉`: `🏅`} - ${lb[i].username} - ${lb[i].messages}\n`; break;
            }
        }

        lbTxt = client.api.cleanse.discord(lbTxt);
        let sEmbed = new Discord.RichEmbed()
            .setColor(0x1e90ff)
            .setAuthor(`Global Leaderboard`, message.author.avatarURL)
            .setTimestamp(new Date())
            .setFooter(config.footer);

        let userRank;
        for(let i = 0; i < lb.length; i++) if(lb[i].id == message.author.id) userRank = i;
        if(!args[0]) {
            sEmbed.setDescription(`
            \`${config.prefix}lb bet\` - Gambling leaderboards.
            \`${config.prefix}lb cash\` - Economical leaderboards.
            \`${config.prefix}lb daily\` - Daily streak leaderboards.
            \`${config.prefix}lb messages\` - Activity leaderboards.
            `);
        }
        if(userRank > 9) {
            switch(args[0]) {
                case `bet`: sEmbed.setDescription(`${lbTxt}\n🎖️ #${userRank + 1} - ${client.api.cleanse.discord(message.author.tag)} - ${client.api.numbers.standardize(lb[userRank].hBet.amount)} [${lb[userRank].hBet.chance}%]`); break;
                case `cash`: sEmbed.setDescription(`${lbTxt}\n🎖️ #${userRank + 1} - ${client.api.cleanse.discord(message.author.tag)} - $${client.api.numbers.standardize(lb[userRank].bal)}`); break;
                case `daily`: sEmbed.setDescription(`${lbTxt}\n🎖️ #${userRank + 1} - ${client.api.cleanse.discord(message.author.tag)} - ${client.api.numbers.standardize(lb[userRank].dailyStreak)}`); break;
                case `messages`: sEmbed.setDescription(`${lbTxt}\n🎖️ #${userRank + 1} - ${client.api.cleanse.discord(message.author.tag)} - ${client.api.numbers.standardize(lb[userRank].messages)}`); break;
            }
        }
        else sEmbed.setDescription(lbTxt)
        return message.channel.send(sEmbed);
    });    
}