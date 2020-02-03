const { config, client } = require(`../index.js`);
const Discord = require(`discord.js`);
const bus = require(`../messageBus.js`);

bus.on(`guildCreate`, guild => console.log(`Bot has been removed from guild ${guild.name} [${guild.id}], which had ${guild.memberCount} members.`));