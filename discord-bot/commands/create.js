const Discord = require(`discord.js`);
const { config } = require(`../index.js`);
const jsonstore = require(`jsonstore.io`);
const request = require(`request`);
let store = new jsonstore(config.jsonstoreToken);

module.exports.run = async(client, message, args) => {
    let ntLink = args[0];
    if(!ntLink) return message.channel.send(`${message.author} You must include your NT account link!`);
    else {
            let realLink = `https://nitrotype.com/racer/`;
            if(ntLink.slice(0, 32) == `https://www.nitrotype.com/racer/`) realLink += ntLink.slice(32);
            else if(ntLink.slice(0, 31) == `http://www.nitrotype.com/racer/`) realLink += ntLink.slice(31);
            else if(ntLink.slice(0, 28) == `https://nitrotype.com/racer/`) realLink += ntLink.slice(28);
            else if(ntLink.slice(0, 27) == `http://nitrotype.com/racer/`) realLink += ntLink.slice(27);
            else if(ntLink.slice(0, 23) == `nitrotype.com/racer/`) realLink += ntLink.slice(20);
            else if(ntLink.slice(0, 20) == `www.nitrotype.com/racer/`) realLink += ntLink.slice(23);
            else if(ntLink.slice(0, 4) != `http`) realLink += ntLink;
            else return message.channel.send(`${message.author} That is an invalid racer profile link!`);

        request(realLink, (err, res, body) => {
            if(realLink.length <= 28) return message.channel.send(`${message.author} That is an invalid link!`);
            else if(realLink.slice(0, 28) != `https://nitrotype.com/racer/`) return message.channel.send(`${message.author}  That is an invalid racer profile link!`);
            else if(body.split(`race`).length <= 2) return message.channel.send(`${message.author} That account doesn't exist!`);

            store.write(`users/${message.author.id}`, {
                balance: 0,
                banned: false,
                highestBet: {
                    chance: 0,
                    amount: 0
                },
                cooldowns: {
                    commands: {
                        bet: 0,
                        daily: 0,
                        delete: new Date(),
                        coinflip: 0,
                        give: 0,
                        report: 0,
                        suggest: 0,
                        withdraw: 0
                    },
                    getCash: 0
                },
                dailyStreak: 0,
                donated: false,
                messageCount: 0,
                ntAccount: realLink,
                user: {
                    name: message.author.username,
                    discriminator: message.author.discriminator,
                    id: message.author.id
                }
            });
            return message.channel.send(`${message.author} Your profile has been created! You must wait \`36\` hours before you can delete it.`);
        });
    }
}

module.exports.config = {
    name: `create`
}