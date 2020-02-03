const { config, client } = require(`../index.js`);
const Discord = require(`discord.js`);
const bus = require(`../messageBus.js`);

bus.on(`guildCreate`, guild => console.log(`Bot has been added to guild ${guild.name} [${guild.id}], which has ${guild.memberCount} members.`));