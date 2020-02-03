const Discord = require(`discord.js`);
const { config } = require(`../index.js`);
const jsonstore = require(`jsonstore.io`);
let store = new jsonstore(config.jsonstoreToken);

module.exports.run = async(client, message, args) => {
    let mR = args[0];
    if(!mR) return message.channel.send(`${message.author} Proper usage is \`${config.prefix}guess <maxRange>\`.`);
    else if(isNaN(parseInt(mR))) return message.channel.send(`${message.author} MaxRange must be an integer!`);
    else if(parseInt(mR) < 25) return message.channel.send(`${message.author} MaxRange must be greater than 25!`);
    else if(parseInt(mR) > 1000) return message.channel.send(`${message.author} MaxRange must be less than 1000! `);
    else mR = parseInt(mR);

    let ans = Math.round(Math.random() * mR);
    let cGuess = undefined;
    let gC = 0;
    let stopGame = false;
  
    const checkAns = ans => {
        message.channel.send(`Choose a number between 0 and ${mR}.`).then(msg => {
            message.channel.awaitMessages(m => m.author == message.author, {
                max: 1,
                time: 30000,
                errors: [`time`]
            }).then(m => {
                if(m.first().content.toString().toLowerCase() == `stop`) {
                    message.channel.send(`Stopping game...`);
                    return stopGame = true;
                }
                cGuess = parseInt(m.first().content);
                if(isNaN(cGuess)) return message.channel.send(`${message.author} That is an invalid guess! Please specify an integer!`);
                gC += 1;

                if(cGuess == ans) {
                    let gP = Math.floor(1 / ((mR / 15) * gC) * (Math.pow(mR, 1.55)));
                    store.read(`users/${message.author.id}/balance`).then(data => store.write(`users/${message.author.id}/balance`, data + gP));
                    store.write(`users/${message.author.id}/cooldowns/commands/guess`, new Date());

                    let sEmbed = new Discord.RichEmbed()
                        .setAuthor(`Guess the Number`, message.author.avatarURL)
                        .setDescription(`You win! You have won \`$${gP}\` from ${gC} guesses!`)
                        .setTimestamp(new Date())
                        .setFooter(config.footer);
                    return message.channel.send(sEmbed);
                }
                else {
                    message.channel.send(`${message.author} Incorrect! Guess ${cGuess < ans ? `higher`: `lower`}! You have guessed ${gC} times so far.`);
                    checkAns(ans);
                }
            }).catch(err => {
                console.error(err);
                message.channel.send(`You didn't guess quick enough!`);
                return stopGame = true;
            });
        });
    }
    if(!stopGame) checkAns(ans);
}
module.exports.config = {
    name: `guess`
}