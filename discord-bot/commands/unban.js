const Discord = require(`discord.js`);
const { config } = require(`../index.js`);
const jsonstore = require(`jsonstore.io`);
const Math = require(`math.js`);
let store = new jsonstore(config.jsonstoreToken);

module.exports.run = async(client, message, args) => {
    if(message.author.id != config.developerID && message.author.id != `386940319666667521`) return message.channel.send(`${message.author} You're not allowed to use that!`);
    let banUser = message.mentions.members.first();
    if(!banUser) return message.channel.send(`Please mention a valid member of this server!`);
    banUser = banUser.user;

    store.read(`users/${banUser.id}/banned`).then(data => {
        if(data == null) return message.channel.send(`${message.author} That user does not have an account!`);
        if(data == false) return message.channel.send(`${message.author} That user is not banned!`);

        store.write(`/users/${banUser.id}/banned`, false);
        message.channel.send(`**${banUser.username}#${banUser.discriminator}** was unbanned from *LeCashBot*.`);
    });
}
 
module.exports.config = {
  name: `unban`
}