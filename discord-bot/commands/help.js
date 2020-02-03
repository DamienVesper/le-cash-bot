const Discord = require(`discord.js`);
const { config } = require(`../index.js`);
const jsonstore = require(`jsonstore.io`);
let store = new jsonstore(config.jsonstoreToken);

module.exports.run = async(client, message, args) => {
    let helpInfo = {
        guides: `
\`${config.prefix}help [category]\` - Display the bot's commands.
\`${config.prefix}faq\` - Display frequently asked questions.
\`${config.prefix}donate\` - Display donators.
`,
        economy: `
\`${config.prefix}daily\` - Collect a daily cash amount!
\`${config.prefix}give <user>\` - Give someone money from your balance.
\`${config.prefix}withdraw <amount>\` - Withdraw money (at least $100K) to be sent to your NT account.
\`${config.prefix}leaderboard\` - View the global leaderboard.
\`${config.prefix}total\` - View the entire cash of the current guild.
\`${config.prefix}profile <user>\` - View yours or another user's profile.
\`${config.prefix}balance <user>\` - View yours or another user's balance.
`,
        games: `
\`${config.prefix}bet <amount>\` - Play roulette.
\`${config.prefix}coinflip <side> <amount>\` - Flip a coin.
\`${config.prefix}guess <maxRange>\` - Guess a number.
`,
        miscellaneous: `
\`${config.prefix}event\` - View the current event, if any.
\`${config.prefix}botinfo\` - Important bot information.
\`${config.prefix}create\` - Make a profile using your NT account.
\`${config.prefix}delete\` - Delete your profile using your NT account.
\`${config.prefix}report <reason>\` - Report a bug in the bot.
\`${config.prefix}suggest <idea>\` - Suggest an idea for ${client.user}.
`
    }

    let cat = args[0];
    cat == `misc` ? cat = `miscellaneous`: cat == `tutorial` ? cat = `guides`: null;

    let sEmbed = new Discord.RichEmbed()
        .setColor(0xFF0000)
        .setAuthor(`Help Menu`, message.author.avatarURL)
        .setTimestamp(new Date())
        .setFooter(config.footer);
    if(cat && helpInfo[cat]) sEmbed.setDescription(helpInfo[cat]);
    else {
        sEmbed
            .setDescription(`For each message you send, you will earn a cash amount between $${config.getCash.min} and $${config.getCash.max}.`)
            .addField(`Guides`, helpInfo.guides)
            .addField(`Economy`, helpInfo.economy)
            .addField(`Games`, helpInfo.games)
            .addField(`Miscellaneous`, helpInfo.miscellaneous)
    }
    return message.channel.send(sEmbed);
}

module.exports.config = {
    name: `help`
}