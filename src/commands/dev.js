const Discord = require(`discord.js`);
const Math = require(`math.js`);
const fs = require(`fs`);
const jsonstore = require(`jsonstore.io`);
const { config, client } = require(`../index.js`);
let store = new jsonstore(config.jsonstoreToken);

module.exports = {
    name: `dev`,
    description: `Commands for developer.`,
    aliases: null,
    usage: `<subcmd> [arg1] [arg2] [arg3]`
}

module.exports.run = async(client, message, args) => { 
    if(!config.perms.developers.includes(message.author.id)) return message.channel.send(`${message.author} You can't use that!`);

    switch(args.shift()) {
        case `reboot`:
            message.channel.send(`${message.author} Succesfully rebooted all shards!`);
            return client.bus.emit(`shard-reboot`);
        case `kill`:
            message.channel.send(`${message.author} Succesfully killed all shards!`);
            return client.bus.emit(`shard-kill`);
        case `reload`:
            if(!client.commands.get(args[0])) return message.channel.send(`${message.author} That command doesn't exist!`);

            let props = require(`./${args[0]}`);
            client.commands.set(props.name, props);
            return message.channel.send(`${message.author} Succesfully reloaded command \`${args[0]}\`.`);
        case `endlot`:
            message.channel.send(`${message.author} Ending lottery...`);
            client.api.lottery.getWinner();
            break;
        case `remake`:
            message.channel.send(`${message.author} Remaking commands...`).then(() => {
                fs.readdir(`./discord-bot/commands/`, (err, files) => {
                    if(err) console.error(err);
                
                    let jsFiles = files.filter(f => f.split(`.`).pop() == `js`);
                    if(jsFiles.length <= 0) return console.log(`No commands to load!`);
                
                    /* Load Commands */
                    jsFiles.forEach(f => {
                        let props = require(`./${f}`);
                        client.commands.set(props.name, props);
                    });
                    return console.log(`[${client.shard.id}]: Loaded ${jsFiles.length} command${jsFiles.length === 1 ? ``: `s`}!`);
                });
            });
        case `lockdown`:
            if(config.devMode) store.write(`devMode`, false);
            else if(!config.devMode) store.write(`devMode`, true);
            else store.write(`devMode`, true);
            store.read(`devMode`).then(data => {
                config.devMode = data;
                message.channel.send(`${message.author} Succesfully toggled developer mode to \`${data}\`.`);
                
                client.destroy().then(() => client.login(config.token));
            });
            break;
        case `restart`:
            message.channel.send(`${message.author} Bot is restarting...`);
            client.destroy().then(() => client.login(config.token));

            let sEmbed = new Discord.RichEmbed()
                .setAuthor(`Bot Restarted`, message.author.avatarURL)
                .setColor(0xffa500)
                .setDescription(`Bot was restarted by ${message.author} in ${message.channel}.`)
                .setTimestamp(new Date())
                .setFooter(config.footer);
            client.users.get(config.developerID).send(sEmbed);
            client.users.get(`386940319666667521`).send(sEmbed);
            break;
        case `shutdown`:
            let xEmbed = new Discord.RichEmbed()
                .setAuthor(`Bot Shutdown`, message.author.avatarURL)
                .setColor(0xff0000)
                .setDescription(`Bot was shutdown by ${message.author} in ${message.channel}.`)
                .setTimestamp(new Date())
                .setFooter(config.footer);
            return client.users.get(config.developerID).send(xEmbed).then(m => client.users.get(`386940319666667521`).send(xEmbed).then(a => message.channel.send(`${message.author} Bot is shutting down...`).then(e => client.destroy())));
        case `reload`:
            let cmd = args[0];
            if(!client.commands.get(cmd)) return message.channel.send(`${message.author} That command doesn't exist!`);
            let prop = require(`./${cmd}.js`);
            client.commands.set(prop.name, prop);
            return message.channel.send(`${message.author} Reloaded **${cmd}.js**.`);
        case `uedit`:
            if(!args[0] || !args[1] || !args[2]) return message.channel.send(`${message.author} Proper usage is \`${config.prefix}dev uedit <user> <attribute> <value>\`.`);
            store.write(`users/${args[0]}/${args[1]}`, isNaN(parseInt(args[2])) ? args[2]: parseInt(args[2]));

            let dEmbed = new Discord.RichEmbed()
                .setAuthor(`Users Edited`, message.author.avatarURL)
                .setColor(0x663399)
                .setDescription(`
                    User <@${args[0]}> was edited by ${message.author} in ${message.channel}.
                    Key: \`${args[1]}\`
                    Value: \`${args[2]}\`
                `)
                .setTimestamp(new Date())
                .setFooter(config.footer);

            client.users.get(config.developerID).send(dEmbed);
            client.users.get(`386940319666667521`).send(dEmbed);
            return message.channel.send(`${message.author} Succesfully changed value of **${client.api.cleanse.discordCleanse(args[1])}** to ${client.api.cleanse.discordCleanse(args[2])} for user \`${client.api.cleanse.discordCleanse(args[0])}\`.`);
        default: return message.channel.send(`${message.author} That is an invalid developer command!`);
    }
}