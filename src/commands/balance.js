const Discord = require(`discord.js`);
const Math = require(`math.js`);
const jsonstore = require(`jsonstore.io`);
const { config } = require(`../index.js`);
let store = new jsonstore(config.jsonstoreToken);

module.exports = {
    name: `balance`,
    description: `View the balance of a user.`,
    aliases: [`bal`],
    usage: `[user]`
}

module.exports.run = async(client, message, args) => {
    let profileUser = args[0];
    if(!profileUser) profileUser = message.member;
    else if(isNaN(parseInt(profileUser))) profileUser = message.mentions.members.first();
    else profileUser = await message.guild.members.get(profileUser);

    if(!profileUser) return message.channel.send(`${message.author} That is an invalid user!`);

    store.read(`users/${profileUser.id}`).then(data => {
        if(!data) return message.channel.send(`${message.author} That user doesn't have an account!`);

        let isDev = config.perms.developers.includes(profileUser.id);
        let isMod = config.perms.moderators.includes(profileUser.id);
        let isDonor = config.perms.donators.includes(profileUser.id);

        let sEmbed = new Discord.RichEmbed()
            .setColor(data.banned ? 0x000000: isDev ? 0xff0000: isMod ? 0x1e90ff : isDonor ? 0xffa500: 0x663399)
            .setAuthor(`${data.banned ? `Banned`: isDev ? `Developer`: isMod ? `Moderator`: isDonor ? `Donator`: `Player`} | ${profileUser.user.tag}`, profileUser.user.avatarURL)
            .setDescription(data.balance === 0 ?
                `${profileUser} doesn't have anything...\nI guess they gambled their life away.`: 
                `${profileUser} has $${client.api.numbers.standardize(data.balance)}.`)
            .setTimestamp(new Date())
            .setFooter(config.footer);
        message.channel.send(sEmbed);
    });    
}