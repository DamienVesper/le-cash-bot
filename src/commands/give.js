const Discord = require(`discord.js`);
const Math = require(`math.js`);
const jsonstore = require(`jsonstore.io`);
const { config } = require(`../index.js`);
let store = new jsonstore(config.jsonstoreToken);

module.exports = {
    name: `give`,
    description: `Give a user some money.`,
    aliases: null,
    usage: `<user> <amount>`
}

module.exports.run = async(client, message, args) => {
    let giveUser = args[0];
    let giveAmt = args[1];
    giveAmt = parseInt(giveAmt);

    if(!giveUser) giveUser = message.member;
    else if(message.mentions.members) giveUser = message.mentions.members.first();
    else if(isNaN(parseInt(giveUser))) return message.channel.send(`${message.author} That is an invalid user!`);
    else giveUser = message.guild.members.get(args[0]);

    if(giveUser.user.id == message.author.id) return message.channel.send(`${message.author} You can't give money to yourself!`);

    if(isNaN(giveAmt)) return message.channel.send(`${message.author} GiveAmount must be an integer!`);
    else if(giveAmt < 500 && message.author.id != config.developerID && message.author.id != `386940319666667521`) return message.channel.send(`${message.author} The minimum amount you can give is \`$500\`!`);

    store.read(`users/${message.author.id}`).then(data => {
        if(data.balance < giveAmt) return message.channel.send(`${message.author} You cannot give more than you own!`);

        store.read(`users/${giveUser.user.id}`).then(xData => {
            if(!xData) return message.channel.send(`${message.author} That user does not have an account!`);
            else if(xData.banned) return message.channel.send(`${message.author} You cannot give money to a banned user!`);

            store.write(`users/${giveUser.user.id}/balance`, xData.balance += giveAmt);
            store.write(`users/${message.author.id}/balance`, data.balance -= giveAmt);

            store.write(`users/${message.author.id}/cooldowns/commands/give`, new Date());
            message.channel.send(`You have succesfully transferred \`$${giveAmt}\` to \`${giveUser.user.tag}\`.`);
        });
    });
}