const Discord = require(`discord.js`);
const jsonstore = require(`jsonstore.io`);
const { config } = require(`../index.js`);
let store = new jsonstore(config.jsonstoreToken);

module.exports = {
    name: `profile`,
    description: `View profiles of users.`,
    aliases: [`p`],
    usage: `[user]`
}

module.exports.run = async(client, message, args) => {
    let profileUser = args[0];
    if(!profileUser) profileUser = message.member;
    else if(isNaN(parseInt(profileUser))) profileUser = message.mentions.members.first();
    else profileUser = await message.guild.members.get(profileUser);

    if(!profileUser) return message.channel.send(`${message.author} That is an invalid user!`);

    store.read(`users/${profileUser.id}`).then(data => {
        if(!data) return message.channel.send(`${message.author} That user doesn't have an account!`);

        let isDev = config.perms.developers.includes(profileUser.id);
        let isMod = config.perms.moderators.includes(profileUser.id);
        let isLegacy = config.perms.legacyDonators.includes(profileUser.id);
        let isDonator = config.perms.donators.includes(profileUser.id);

        store.read(`users`).then(xData => {
            let lb = [];
            for(let i in xData) {
                if(xData[i].user && xData[i].user.username != `LeCashBot`) {
                    let discProc = client.users.get(xData[i].user.id);
                    if(discProc && !xData[i].banned) {
                      lb.push({
                          bal: xData[i].balance,
                          dailyStreak: xData[i].dailyStreak,
                          hBet: {
                              amount: xData[i].highestBet.amount,
                              chance: xData[i].highestBet.chance
                          },
                          id: xData[i].user.id,
                          messages: xData[i].messageCount,
                          username: discProc.tag
                      });
                    }
                }
            }
            lb.sort((a, b) => (a.bal <= b.bal) ? 1 : -1);
            let userRank;
            for(let i = 0; i < lb.length; i++) if(lb[i].id == message.author.id) userRank = i;


            let sEmbed = new Discord.RichEmbed()
                .setColor(data.banned ? 0x000000: isDev ? 0xff0000: isMod ? 0x1e90ff : isDonator ? 0xffa500: 0x663399)
                .setAuthor(`${data.banned ? `Banned`: isDev ? `Developer`: isMod ? `Moderator`: isLegacy ? `Legacy Donator`: isDonator ? `Donator`: `Player`} | ${profileUser.user.tag}`, profileUser.user.avatarURL, data.ntAccount)
                .setDescription(`${data.rank === undefined ? `This user is not ranked yet!`: `Rank: ${data.rank}`}`)
                .addField(`Info`, `
                    Balance: $${client.api.numbers.standardize(data.balance)}
                    Highest Bet: $${client.api.numbers.standardize(data.highestBet.amount)}
                    Bet Chance: ${data.highestBet.chance}%
                `, true)
                .addField(`Stats`, `
                    Daily Streak: ${data.dailyStreak}
                    Messages Sent: ${data.messageCount}
                    Leaderboard Rank: ${userRank + 1} / ${lb.length}
                `, true)
                .setTimestamp(new Date())
                .setFooter(config.footer);
            return message.channel.send(sEmbed);
        });
    });
}