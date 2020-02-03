const { config, client } = require(`../index.js`);
const Discord = require(`discord.js`);
const bus = require(`../messageBus.js`);

bus.on(`guildMemberRemove`, guild => console.log(`User ${member.user.tag} has left guild ${member.guild.name} [${member.guild.id}], which now has ${member.guild.memberCount} members.`));