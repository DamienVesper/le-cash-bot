﻿/* Dependencies */
const Discord = require(`discord.js`);
const Math = require(`math.js`);
const jsonstore = require(`jsonstore.io`);
const fs = require(`fs`);
const dotenv = require(`dotenv`).config();

/* Client Configuration */
const cooldowns = require(`../databases/cooldowns.json`);
let client = new Discord.Client({
  disableEveryone: true,
  fetchAllMembers: true,
  sync: true
});
var config = {
    perms: require(`../databases/perms.json`),
    getCash: {
        min: 100,
        max: 250
    },
    developerID: `296862365503193098`,
    devMode: true,
    event: {
        startDate: new Date(),
        multiplier: 1,
    },
    logChannel: `683845354705125392`,
    lotteryAmount: 5e3,
    lotteryChannel: `683855704737579037`,
    prefix: `$`,
    token: process.env.DISCORD_BOT_TOKEN,
    jsonstoreToken: process.env.JSONSTORE_TOKEN,
    version: `2.0.0 `,
    footer: `© LeCashBot 2020`
}

let store = new jsonstore(config.jsonstoreToken);
config.footer += ` | v${config.version}`;
module.exports = { config, client };

client.api = require(`./api.js`);
client.bus = require(`../bus.js`);

store.read(`devMode`).then(data => {
    if(data === null) store.write(`devMode`, true);
    else if(data) config.devMode = true;
    else if(!data) config.devMode = false;
});

const refreshActivity = async() => {
    /* Client Activity */
    const botGame = `Nitro Type`;
    client.user.setPresence({
        game: {
            name: config.devMode ? `In Development`: `${client.users.size} users on ${botGame}`,
            type: config.devMode ? `PLAYING`: `WATCHING`
        },
        status: config.devMode ? `dnd`: `idle`
    });
}

client.on(`ready`, () => {
    console.log(`Bot has started with ${client.users.size} users in ${client.guilds.size} guilds.`);
    refreshActivity();

    //Autobackup profiles
    setInterval(() => {
        store.read(`cooldowns/backup`).then(data => { if(!data || new Date() - new Date(data) >= 864e5) return client.api.data.backup(new Date()); });
        store.read(`cooldowns/lottery`).then(data => {
            if(!data) store.write(`cooldowns/lottery`, new Date());
            if(new Date() - new Date(data) >= 6048e5) {
                store.read(`lottery`).then(xData => {
                    if(!xData.users) {
                        let xEmbed = new Discord.RichEmbed()
                            .setColor(0x000000)
                            .setAuthor(`Lottery Results`)
                            .setDescription(`There were no participants 😭.`)
                            .setTimestamp(new Date())
                            .setFooter(config.footer);
                        return client.channels.get(config.lotteryChannel).send(xEmbed);
                    }
                    let randomUser = client.users.get(xData.users[Math.floor(Math.random() * xData.users.length)]);
                    let sEmbed = new Discord.RichEmbed()
                        .setColor(0x000000)
                        .setAuthor(`Lottery Results`)
                        .setDescription(`
                            Participants: ${xData.users.length}
                            Winner: ${randomUser}
                            Prize: $${client.api.numbers.standardize(xData.funds)}
                        `)
                        .setTimestamp(new Date())
                        .setFooter(config.footer);
                    
                    store.read(`users/${randomUser.id}/balance`).then(sData => {
                        store.write(`users/${randomUser.id}/balance`, sData + xData.funds);
                        store.write(`lottery`, {
                            users: [],
                            funds: 0,
                            start: new Date()
                        });
                        store.write(`cooldowns/lottery`, new Date());
                        client.channels.get(config.lotteryChannel).send(`<@${randomUser.id}>`).then(m => m.edit(sEmbed));
                    });
                });
            }
        });
    }, 6e4);
});

/* Client Commands */
console.log(`Loading commands...`);
client.commands = new Discord.Collection();
fs.readdir(`./src/commands/`, (err, files) => {
    if(err) console.error(err);
    files.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`${i + 1}: Loaded ${f}.`);
        client.commands.set(props.name, props);
    });
});
console.log(`Loading events...`);
fs.readdir(`./src/events`, (err, files) => {
    if(err) return console.error(err);
    files.forEach((f, i) => {
        let props = require(`./events/${f}`);
        console.log(`${i + 1}: Loaded ${f}.`);
    });
});

//Refresh Activity on Member Event  
client.on(`guildCreate`, async member => refreshActivity());
client.on(`guildRemove`, async member => refreshActivity());
client.on(`guildMemberAdd`, async member => refreshActivity());
client.on(`guildMemberRemove`, async member => refreshActivity());

client.on(`message`, message => {
    if(message.author.bot) return;
    else if(message.channel.type == `dm`) {
      let sEmbed = new Discord.RichEmbed()
        .setAuthor(message.author.username, message.author.avatarURL)
        .setDescription(`**Direct Message**: ${message.author.id == `386940319666667521` || message.author.id == config.developerID ? message.content: client.api.cleanse.discord(message.content)}`)
        .setTimestamp(new Date())
        .setFooter(config.footer);
      try {
        if(message.author.id == config.developerID) client.users.get(`386940319666667521`).send(sEmbed).catch(err => message.react(`❌`)).then(message.react(`✅`));
        else if(message.author.id == `386940319666667521`) client.users.get(config.developerID).send(sEmbed).catch(err => message.react(`❌`)).then(message.react(`✅`));
        else {
          client.users.get(`386940319666667521`).send(sEmbed);
          client.users.get(config.developerID).send(sEmbed);
          return message.channel.send(`${message.author} A warning has been sent to the developers. Please do not DM the bot, for any reason.`);
        }
      }
      catch(err) { console.log(err); }
    }

  if(config.devMode && !config.perms.developers.includes(message.author.id)) return;
    store.read(`users/${message.author.id}`).then(data => {
        if(data && data.banned && !config.perms.developers.includes(message.author.id)) return;
        if(message.content.slice(0, config.prefix.length) == config.prefix) {
            //Command Handling
            const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
            let command = args.shift().toLowerCase();

            if(!data) {
                switch(command) {
                    case `help`: return client.commands.get(`help`).run(client, message, args); break;
                    case `botinfo`: return client.commands.get(`botinfo`).run(client, message, args); break;
                    case `info`: return client.commands.get(`botinfo`).run(client, message, args); break;
                    case `faq`: return client.commands.get(`faq`).run(client, message, args); break;
                    case `create`: return client.commands.get(`create`).run(client, message, args); break;
                    case `delete`: return message.channel.send(`${message.author} You do not have an account!`); break;
                    default:
                        let sEmbed = new Discord.RichEmbed()
                            .setAuthor(message.author.username, message.author.avatarURL)
                            .setDescription(`You do not have an account. Please do \`${config.prefix}create <NT account link>\` to create one.`)
                            .setTimestamp(new Date())
                            .setFooter(config.footer);
                        message.channel.send(sEmbed);
                        break;
                }
            }
            else {
                switch(command) {
                    case `bal`: command = `balance`; break;
                    case `cf`: command = `coinflip`; break;
                    case `claim`: command = `daily`; break;
                    case `g`: command = `guess`; break;
                    case `info`: command = `botinfo`; break;
                    case `lb`: command = `leaderboard`; break;
                    case `p`: command = `profile`; break;
                    case `top`: command = `leaderboard`; break;
                    case `with`: command = `withdraw`; break;
                }
                let cd = {
                    user: data.cooldowns.commands[command],
                    actual: cooldowns.commands[command]
                }
                if(cd.user && ((new Date() - new Date(cd.user)) < cd.actual)) {
                    const msgTxt = [(cd.actual - (new Date() - new Date(cd.user))) / 1000];
                    msgTxt.push(Math.round((msgTxt[0]) / 3600));

                    let sEmbed = new Discord.RichEmbed()
                        .setAuthor(message.author.username, message.author.avatarURL)
                        .setDescription(`You cannot use \`${config.prefix + command}\` for another \`${command == `daily` ? msgTxt[1] + `\` ` + (msgTxt[1] == 1 ? `hour`: `hours`): msgTxt[0] + `\` ` + (msgTxt[0] == 1 ? `second`: `seconds`)}.`)
                        .setTimestamp(new Date())
                        .setFooter(config.footer);
                    return message.channel.send(sEmbed);
                }

                console.log(`${message.author.tag} ran command ${config.prefix}${command} in #${message.channel.name}.`);
                switch(command) {
                    case `create`: return message.channel.send(`${message.author} You already have a profile!`);
                    default:
                        let cmd = client.commands.get(command);
                        if(cmd) {
                            if((cmd.usage) && args.length < (cmd.usage.split(`<`).length) - 1) return message.channel.send(`${message.author} Proper usage is \`${config.prefix + cmd.name} ${cmd.usage}\`.`);
                            return cmd.run(client, message, args);
                        }
                        else return;
                }
            }
        }
        else {
            if(!data || config.devMode || !message.guild) return;
            if(message.channel.name.slice(0, 12) == `bot-commands`) return;
            else if(new Date() - new Date(data.cooldowns.getCash) > cooldowns.getCash) {
                let randCash = Math.floor(Math.random() * 100) + (config.perms.legacyDonators.includes(message.author.id ? 450: 50));

                store.write(`users/${message.author.id}/balance`, data.balance + randCash);
                store.write(`users/${message.author.id}/cooldowns/getCash`, new Date());

                let lC = client.channels.get(config.logChannel);
                if(lC) lC.send(`**${client.api.cleanse.discord(message.author.tag)}** earned \`$${randCash}\` by chatting in **#${client.api.cleanse.discord(message.channel.name)}**.`).catch(err => console.error(`Failed to log user update.`));
            }
            store.write(`users/${message.author.id}/messageCount`, data.messageCount + 1);
        }
    });
});

client.login(config.token).catch(err => console.error(`Failed to login to Discord.`));