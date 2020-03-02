const dotenv = require(`dotenv`).config();
const bus = require(`../bus.js`);

const { ShardingManager } = require(`discord.js`);
const shardManager = new ShardingManager(`./discord-bot/index.js`, { token: process.env.DISCORD_BOT_TOKEN });

shardManager.spawn().catch(err => console.log(`Failed to launch shard.`));

shardManager.on(`launch`, shard => console.log(`Launched shard ${shard.id}.`));
shardManager.on(`message`, shard => {
    bus.on(`shard-kill`, () => shard.kill());
    bus.on(`shard-reboot`, () => shard.respawn());
});