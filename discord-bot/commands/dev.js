const Discord = require(`discord.js`);
const { config } = require(`../index.js`);
const cleanseAPI = require(`../api/cleanse.js`);
const dataAPI = require(`../api/data.js`);
const jsonstore = require(`jsonstore.io`);
let store = new jsonstore(config.jsonstoreToken);

module.exports.run = async(client, message, args) => {
    if(message.author.id != config.developerID && message.author.id != `386940319666667521` && message.author.id != `451585216033718272`) return message.channel.send(`${message.author} You can't use that!`);
    switch(args[0]) {
        case `uedit`:
            if(!args[1] || !args[2] || !args[3]) return message.channel.send(`${message.author} Proper usage is \`${config.prefix}dev uedit <user> <attribute> <value>\`.`);
            store.write(`users/${args[1]}/${args[2]}`, isNaN(parseInt(args[3])) ? args[3]: parseInt(args[3]));

          let dEmbed = new Discord.RichEmbed()
              .setAuthor(`Users Edited`, message.author.avatarURL)
              .setColor(0x663399)
              .setDescription(`User <@${args[1]}> was edited by ${message.author} in ${message.channel}.`)
              .setTimestamp(new Date())
              .setFooter(config.footer);

          client.users.get(config.developerID).send(dEmbed);
          client.users.get(`386940319666667521`).send(dEmbed);
          return message.channel.send(`${message.author} Succesfully changed value of **${cleanseAPI.discordCleanse(args[2])}** to ${cleanseAPI.discordCleanse(args[3])} for user \`${cleanseAPI.discordCleanse(args[1])}\`.`);
        case `backup`:
          let aEmbed = new Discord.RichEmbed()
              .setAuthor(`Users Backed Up`, message.author.avatarURL)
              .setColor(0x1e90ff)
              .setDescription(`Userdata was backed up by ${message.author} in ${message.channel}.`)
              .setTimestamp(new Date())
              .setFooter(config.footer);

          dataAPI.backup();

          client.users.get(config.developerID).send(aEmbed);
          client.users.get(`386940319666667521`).send(aEmbed);
          return message.channel.send(`${message.author} Succesfully backed up data for *${new Date()}*.`);
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
        default: return message.channel.send(`${message.author} That is an invalid developer command!`);
  }
}

module.exports.config = {
    name: `dev`
}