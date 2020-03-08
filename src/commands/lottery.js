const Discord = require(`discord.js`);
const Math = require(`math.js`);
const jsonstore = require(`jsonstore.io`);
const { config } = require(`../index.js`);
let store = new jsonstore(config.jsonstoreToken);

module.exports = {
    name: `lottery`,
    description: `Join the lottery.`,
    aliases: null,
    usage: null
}

module.exports.run = async(client, message, args) => {
    message.channel.send(`Do you want to enter the lottery? Type \`yes\` or \`no\` to confirm.`).then(m => {
        message.channel.awaitMessages(a => a.author == message.author, {
            max: 1,
            time: 3e4,
            errors: [`time`]
        }).then(b => {
            let confJoin = b.first().content.toString().toLowerCase() == `yes` ? true: false;
            store.read(`users/${message.author.id}`).then(data => {
                if(!confJoin) return message.channel.send(`${message.author} Did not join the lottery.`);
                store.read(`lottery`).then(xData => {
                    if(!xData) return store.write(`lottery`, {
                        users: [],
                        funds: 0,
                        start: new Date()
                    });
                    else if(xData.users && xData.users.includes(message.author.id)) return message.channel.send(`${message.author} You have already joined the current lottery!`);
                    else if(data.balance < config.lotteryAmount) return message.channel.send(`${message.author} You need at least \`$${client.api.numbers.standardize(config.lotteryAmount)}\` to join the lottery.`);

                    if(!xData.users) xData.users = [];
                    xData.users.push(message.author.id);

                    store.write(`lottery/funds`, xData.funds ? xData.funds + config.lotteryAmount: config.lotteryAmount);
                    store.write(`users/${message.author.id}/balance`, data.balance - config.lotteryAmount);
                    store.write(`lottery/users`, xData.users);
                    return message.channel.send(`${message.author} You paid \`$${client.api.numbers.standardize(config.lotteryAmount)}\` to join the lottery.`);
                });
            });
        })
        .catch(err => message.channel.send(`${message.author} You did not respond in time!`));
    });
}