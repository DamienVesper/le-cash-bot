const Discord = require(`discord.js`);
const Math = require(`math.js`);
const jsonstore = require(`jsonstore.io`);
const { config } = require(`../index.js`);
let store = new jsonstore(config.jsonstoreToken);

module.exports = {
    name: `bet`,
    description: `Play roulette.`,
    aliases: null,
    usage: `<amount>`
}

module.exports.run = async(client, message, args) => {
    let betAmt = args[0];

    if(!betAmt) return message.channel.send(`${message.author} Proper usage is: \`${config.prefix}bet <amount>\`.`);
    else if(typeof bet == `string` && betAmt != `all` && betAmt != `half`) return message.channel.send(`${message.author} That is an invalid amount!`);
    else if(isNaN(parseInt(betAmt))) return message.channel.send(`${message.author} BetAmount must be an integer!`);
    else betAmt = parseInt(betAmt);

    store.read(`users/${message.author.id}`).then(data => {
        if(betAmt > data.balance) return message.channel.send(`${message.author} You can't bet more money than you own!`);
        else if(betAmt < 250) return message.channel.send(`${message.author} You must bet at least $250.`);

        let rand = Math.floor(Math.random() * 50) + 1200
        let winC = Math.floor(Math.random() * 100);
        let algorithm = rand / (Math.pow(3.25, Math.log10(betAmt)));

        if(betAmt > data.highestBet.amount && winC <= algorithm) {
            message.channel.send(`**UP!** ${message.author} You got a new highest bet, beating your previous of \`$${data.highestBet.amount}\`!`);
            store.write(`users/${message.author.id}/highestBet/`, {
                chance: winC,
                amount: betAmt
            });
        }
    
        store.write(`users/${message.author.id}/balance`, winC <= algorithm ? data.balance += betAmt: data.balance -= betAmt);
        store.write(`users/${message.author.id}/cooldowns/commands/bet/`, new Date());

        let sEmbed = new Discord.RichEmbed()
            .setAuthor(message.author.username, message.author.avatarURL)
            .setDescription(`You ${winC <= algorithm ? `earned`: `lost`} \`$${betAmt}\` in roulette. \nLuck: \`${algorithm.toString().slice(0, 7)}%\``)
            .setTimestamp(new Date())
            .setFooter(config.footer);
        message.channel.send(sEmbed);
    });
}