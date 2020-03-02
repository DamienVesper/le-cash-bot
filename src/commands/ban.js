const Discord = require(`discord.js`);
const Math = require(`math.js`);
const jsonstore = require(`jsonstore.io`);
const { config } = require(`../index.js`);
let store = new jsonstore(config.jsonstoreToken);

module.exports = {
    name: `ban`,
    description: `Ban a user.`,
    aliases: null,
    usage: `<user>`
}

module.exports.run = async(client, message, args) => {
    if(!config.perms.developers.includes(message.author.id) && !config.perms.moderators.includes(message.author.id)) return message.channel.send(`${message.author} You're not allowed to use that!`);
    let bnUser = message.mentions.members.first();
    if(!bnUser) return message.channel.send(`Please mention a valid member of this server!`);
    let banUser = bnUser.user;

    store.read(`users/${banUser.id}/banned`).then(data => {
        if(data == null) return message.channel.send(`${message.author} That user does not have an account!`);
        else if(data == true) return message.channel.send(`${message.author} That user is already banned!`);
        else if(config.perms.developers.includes(banUser.id)) return message.channel.send(`${message.author} You cannot ban a developer!`);

        if(!config.perms.developers.includes(message.author.id)) store.write(`/users/${banUser.id}/banned`, true);
        return message.channel.send(`**${banUser.username}#${banUser.discriminator}** was banned from *LeCashBot*.`);
    });
}