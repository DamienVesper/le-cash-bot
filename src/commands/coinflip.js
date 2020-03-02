const Discord = require(`discord.js`);
const Math = require(`math.js`);
const jsonstore = require(`jsonstore.io`);
const { config } = require(`../index.js`);
let store = new jsonstore(config.jsonstoreToken);

module.exports = {
    name: `coinflip`,
    description: `Coinflip an amount.`,
    aliases: [`cf`],
    usage: `<side> <amount>`
}

module.exports.run = async(client, message, args) => {
    let bet = args[0];
    let betAmt = args[1];
    if(typeof bet == `string`) bet = bet.toLowerCase();

    if(bet != `heads` && bet != `tails`) return message.channel.send(`${message.author} The bet must either be \`heads\` or \`tails\`!`);
    else if(isNaN(parseInt(betAmt))) return message.channel.send(`${message.author} BetAmount must be an integer!`);
    else betAmt = parseInt(betAmt);

    store.read(`users/${message.author.id}`).then(data => {
        if(betAmt > data.balance) return message.channel.send(`${message.author} You cannot bet more money than you own!`);
        else if(betAmt <= 0) return message.channel.send(`${message.author} You must bet at least $1!`);
        else if(betAmt > 5e4) return message.channel.send(`${message.author} The most you can bet is $50,000!`);

        let coinflip = Math.round(Math.random());
        console.log(coinflip);
        coinflip == 0 ? coinflip = `tails`: coinflip = `heads`;

        store.write(`users/${message.author.id}/balance`, bet == coinflip ? data.balance += betAmt: data.balance -= betAmt);
        store.write(`users/${message.author.id}/cooldowns/commands/coinflip`, new Date());

        let sEmbed = new Discord.RichEmbed()
            .setAuthor(`Coinflip`, message.author.avatarURL)
            .setDescription(`You ${bet == coinflip ? `earned`: `lost`} \`$${betAmt}\` in the toss.`)
            .setTimestamp(new Date())
            .setFooter(config.footer);
        return message.channel.send(sEmbed);
    });
}