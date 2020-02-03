const Discord = require(`discord.js`);
const { config } = require(`../index.js`);
const moneyAPI = require(`../api/money.js`);
const jsonstore = require(`jsonstore.io`);
let store = new jsonstore(config.jsonstoreToken);

module.exports.run = async(client, message, args) => {
    store.read(`users`).then(data => {
        let totalBal = 0;
        for(let i in data) {
            if(data[i].user.id != `586645522614583306`) totalBal += data[i].balance; //replace id with client.user.id on bot transfer
        }
        store.read(`users/586645522614583306/balance`).then(mBal => { //replace id with client.user.id on bot transfer
            let sEmbed = new Discord.RichEmbed()
                .setColor(0x00ff00)
                .setAuthor(message.author.username, message.author.avatarURL)
                .setDescription(`The total balance of all users is \`$${moneyAPI.standardize(totalBal)}\`.\nThere is currently \`$${moneyAPI.standardize(mBal)}\` left to give away.`)
                .setTimestamp(new Date())
                .setFooter(config.footer);
            return message.channel.send(sEmbed);
        });
    });
}

module.exports.config = {
    name: `total`
}