const Discord = require(`discord.js`);
const Math = require(`math.js`);
const jsonstore = require(`jsonstore.io`);
const { config } = require(`../index.js`);
let store = new jsonstore(config.jsonstoreToken);

module.exports = {
    name: `faq`,
    description: `View Frequenty Asked Questions.`,
    aliases: [`frequentlyaskedquestions`],
    usage: null
}

module.exports.run = async(client, message, args) => {
    let sEmbed = new Discord.RichEmbed()
        .setColor(0xff0000)
        .setAuthor(`Frequently Asked Questions`, message.author.avatarURL)
        .addField(`Can I add this bot to my server?`, `Sorry, but invitations for this bot have been disabled to prevent cash farming.`)
        .addField(`None of the commands are working for me but for everyone else. Why?`, `This probably means that you haven't created a profile using \`$create <NT account link>\`. If you are having issues, use \`$help\` or \`$report\`.`)
        .addField(`It says I already made an account but I actually didn't!`, `Make sure that you didn't put any weird spaces or enters between \`$create\` and your link.`)
        .addField(`Where does the money come from?`, `All of the money that you earn from chatting on Discord comes from my own NT account; I will run out someday.`)
        .addField(`How does me chatting generate actual NitroType cash?`, `I have setup a system that keeps track of your balance, name, ID, NT Account link, etc. As soon as a user withdraws from their account, I am notified to gift them their withdrawed amount. This is why you must have at least $100K before withdrawing.`)
        .addField(`I have a suggestion but I don't know who to contact/LeSirH is never online to answer them.`, `You may DM me and I will answer shortly. Otherwise, you may talk to someone online in the server to contact me or another developer of the bot. Don't tag me in <#564881617630396426>, please.`)
        .addField(`How can I help make this bot better?`, `If you want to become a developer for this bot, DM me that you do, what experience you have, and any questions you might have. Other than that, donations are always welcome. ;)`)
        .setTimestamp(new Date())
        .setFooter(config.footer);
    return message.channel.send(sEmbed);
}