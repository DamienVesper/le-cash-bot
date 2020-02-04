/* Installed Dependencies */
const Discord = require(`discord.js`);
const Math = require(`math.js`);
const jsonstore = require(`jsonstore.io`);
const fs = require(`fs`);
const dotenv = require(`dotenv`).config();

/* Local Dependencies */
const bus = require(`./messageBus.js`);
const cooldowns = require(`../databases/cooldowns.json`);

/* Client Configuration */
let client = new Discord.Client({
  disableEveryone: true,
  fetchAllMembers: true,
  sync: true
});
var config = {
    developer: `LeSirH`,
    developerTag: `3301`,
    developerID: `296862365503193098`,
    getCash: {
        min: 100,
        max: 250
    },
    devMode: true,
    event: {
        startDate: new Date(),
        multiplier: 1,
    },
    logChannel: `587716900721786880`,
    prefix: `$`,
    token: process.env.DISCORD_BOT_TOKEN,
    jsonstoreToken: process.env.JSONSTORE_TOKEN,
    version: `0.0.1`,
    footer: `© LeCashBot 2019`
}
let store = new jsonstore(config.jsonstoreToken);
config.footer = `© LeCashBot 2019 | v${config.version}`;
module.exports = { config };

store.read(`devMode`).then(data => {
  if(data === null) store.write(`devMode`, true);
  else if(data) config.devMode = true;
  else if(!data) config.devMode = false;
});

const dataAPI = require(`./api/data.js`);
const cleanseAPI = require(`./api/cleanse.js`);

/* Client Activity */
const refreshActivity = async() => {
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
    // console.log(`Current Guilds: ${client.guilds.map(g => g.name).join(`\n`)}`);
    refreshActivity();

    //Autobackup profiles
    setInterval(() => {
        store.read(`cooldowns/backup`).then(data => {
            if(!data || new Date() - new Date(data) >= 864e5) return dataAPI.backup();
        });
    }, 6e4);
});

/* Other Client Events */
let clientEvents = [
    require(`./clientEvents/guildCreate`),
    require(`./clientEvents/guildRemove`),
    require(`./clientEvents/guildMemberAdd.js`),
    require(`./clientEvents/guildMemberRemove.js`)
];

/* Client Commands */
client.commands = new Discord.Collection();
fs.readdir(`./discord-bot/commands/`, (err, files) => {
    if(err) console.error(err);

    let jsfiles = files.filter(f => f.split(`.`).pop() == `js`);
    if(jsfiles.length <= 0) return console.log(`No commands to load!`);

    /* Load Commands */
    console.log(`Loading ${jsfiles.length} command(s)!`);
    jsfiles.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`${i + 1}: Loaded ${f}.`);
        client.commands.set(props.config.name, props);
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
        .setDescription(`**Direct Message**: ${message.author.id == `386940319666667521` || message.author.id == config.developerID ? message.content: cleanseAPI.discordCleanse(message.content)}`)
        .setTimestamp(new Date())
        .setFooter(config.footer);
      try {
        if(message.author.id != `386940319666667521`) client.users.get(`386940319666667521`).send(sEmbed).catch(err => message.react(`❌`)).then(message.react(`✅`));
        else if(message.author.id != config.developerID) client.users.get(config.developerID).send(sEmbed).catch(err => message.react(`❌`)).then(message.react(`✅`));
        else if(message.author.id != `386940319666667521` && message.author.id != config.developerID) message.channel.send(`${message.author} A warning has been sent to the developers. Please do not DM the bot, for any reason.`);
      }
      catch(err) { console.log(err); }
    }
    if(config.devMode && message.author.id != config.developerID && message.author.id != `386940319666667521`) return;
    store.read(`users/${message.author.id}`).then(data => {
        if(data && data.banned && message.author.id != `386940319666667521` && message.author.id != config.developerID) return;
        if(message.content.slice(0, config.prefix.length) == config.prefix) {
            // if(message.guild.id == `564880536401870858` && message.channel.name.slice(0, 12) != `bot-commands` && message.channel.name.length >= 4) return;
            
            //Command Handling
            const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
            const command = args.shift().toLowerCase();

            // if(message.author.id == `493900686174453770`) return;

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
                    case `info`: return client.commands.get(`botinfo`).run(client, message, args);
                    case `with`: return client.commands.get(`withdraw`).run(client, message, args);
                    case `p`: return client.commands.get(`profile`).run(client, message, args);
                    case `bal`: return client.commands.get(`balance`).run(client, message, args);
                    case `g`: return client.commands.get(`guess`).run(client, message, args);
                    case `lb`: return client.commands.get(`leaderboard`).run(client, message, args);
                    case `top`: return client.commands.get(`leaderboard`).run(client, message, args);
                    case `create`: return message.channel.send(`${message.author} You already have a profile!`);
                    default:
                        let cmd = client.commands.get(command);
                        if(cmd) cmd.run(client, message, args);
                        else return;
                }
            }
        }
        else {
            if(!data || config.devMode) return;
            let ags = message.content.slice(` `);

            if(message.guild && message.guild.id == `564880536401870858` && message.channel.name.slice(0, 12) == `bot-commands`) return;
            // else if(ags.includes(`lesirh`) || ags.includes(`le$irh`) || ags.includes(`lesir`) || ags.includes(`le$ir`)) return message.guild.members.get(config.developerID).send(`<@${config.developerID}> Please answer the message from ${message.author} in ${message.channel}\nMessage: ${cleanseAPI.discordCleanse(message.content)}.`);
            else if(message.guild && new Date() - new Date(data.cooldowns.getCash) > cooldowns.getCash) {
                let randCash = Math.floor(Math.random() * 100) + ((message.author.id == `451503123589103636` || message.author.id == `363082908270985217` || message.author.id == `300463822991392769`) ? 450: 50);

                store.write(`users/${message.author.id}/balance`, data.balance + randCash);
                store.write(`users/${message.author.id}/cooldowns/getCash`, new Date());

                let lC = client.channels.get(config.logChannel);
                if(lC) lC.send(`**${cleanseAPI.discordCleanse(message.author.tag)}** earned \`$${randCash}\` by chatting in **#${cleanseAPI.discordCleanse(message.channel.name)}**.`).catch(err => console.err(`Failed to log user update.`));
            }
            store.write(`users/${message.author.id}/messageCount/`, data.messageCount + 1);
        }
    });
});

client.login(config.token).catch(err => console.error(`Failed to login to Discord.`));

dataAPI.restoreV2(`./backups/2020_31_01.json`);
// dataAPI.resetMessages();