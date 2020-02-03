const Discord = require(`discord.js`);
const { config } = require(`../index.js`);
const jsonstore = require(`jsonstore.io`);
let store = new jsonstore(config.jsonstoreToken);

module.exports.run = async(client, message, args) => {
    let withAmt = args[0];
    if(!withAmt) return message.channel.send(`${message.author} Proper usage is \`${config.prefix}withdraw <amount>\`.`);
    else if(isNaN(withAmt)) return message.channel.send(`${message.author} WithdrawAmount must be an integer!`);
    else withAmt = parseInt(withAmt);

    store.read(`users/${message.author.id}`).then(data => {
        if(data.balance < withAmt) return message.channel.send(`${message.author} You cannot withdraw more than you own!`);
        else if(withAmt < 1e5) return message.channel.send(`${message.author} You must withdraw at least $**100K**!`);
        store.write(`users/${message.author.id}/balance`, data.balance - withAmt);

        let sEmbed = new Discord.RichEmbed()
            .setAuthor(message.author.username, message.author.avatarURL)
            .setDescription(`${message.author} has withdrawn \`${withAmt}\` from their account. Please pay out their money [here](${data.ntAccount}).`)
            .setTimestamp(new Date())
            .setFooter(config.footer);
        client.users.get(config.developerID).send(sEmbed);
        client.users.get(`386940319666667521`).send(sEmbed);

        let xEmbed = new Discord.RichEmbed()
            .setAuthor(message.author.username, message.author.avatarURL)
            .setDescription(`You have succesfully withdrawn \`${withAmt}\` from your account. Please wait patiently for your payout.`)
            .setTimestamp(new Date())
            .setFooter(config.footer);
        return message.channel.send(xEmbed);
    });
}

module.exports.config = {
    name: `withdraw`
}