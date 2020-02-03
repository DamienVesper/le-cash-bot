const Discord = require(`discord.js`);
const { config } = require(`../index.js`);
const jsonstore = require(`jsonstore.io`);
const Math = require(`math.js`);
let store = new jsonstore(config.jsonstoreToken);

module.exports.run = async(client, message, args) => {
    if(message.author.id != config.developerID && message.author.id != `386940319666667521`) return message.channel.send(`${message.author} You're not allowed to use that!`);
    let bnUser = message.mentions.members.first();
    if(!bnUser) return message.channel.send(`Please mention a valid member of this server!`);
    let banUser = bnUser.user;

    store.read(`users/${banUser.id}/banned`).then(data => {
        if(data == null) return message.channel.send(`${message.author} That user does not have an account!`);
        else if(data == true) return message.channel.send(`${message.author} That user is already banned!`);
        else if(banUser.id == `386940319666667521` || banUser.id == config.developerID) return message.channel.send(`${message.author} You cannot ban a developer!`);

        store.write(`/users/${banUser.id}/banned`, true);
        message.channel.send(`**${banUser.username}#${banUser.discriminator}** was banned from *LeCashBot*.`);
    });
}
 
module.exports.config = {
  name: `ban`
}