const Discord = require(`discord.js`);
const { config } = require(`../index.js`);
const jsonstore = require(`jsonstore.io`);
let store = new jsonstore(config.jsonstoreToken);

module.exports.run = async(client, message, args) => {
    message.channel.send(` Are you sure you want to do this? Any money that you have not withdrawn **will not** be paid out Type 'Yes' to confirm.`).then(msg => {
        message.channel.awaitMessages(m => m.author == message.author, {
            max: 1,
            time: 30000,
            errors: [`time`]
        }).then(a => {
            let b = a.first().content.toString().toLowerCase();
            switch(b) {
                case `yes`:
                    store.delete(`users/${message.author.id}`);
                    return message.channel.send(`${message.author} Account deleted succesfully.`);
                case `no`: return message.channel.send(`${message.author} Account deletion terminated. To resume, run the command again.`);
                default: return message.channel.send(`${message.author} Unrecognized response. Account deletion terminated.`);
            }
        }).catch(err => message.channel.send(`${message.author} Did not get a response in the allotted time. Account deletion terminated.`));
    });
}

module.exports.config = {
    name: `delete`
}