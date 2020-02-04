const { config } = require(`../index.js`);
const fs = require(`fs`);
const jsonstore = require(`jsonstore.io`);
let store = new jsonstore(config.jsonstoreToken);

module.exports.backup = async() => {
    let cD = new Date();

    let fileName = `${cD.getUTCFullYear()}_`;
    fileName += (cD.getUTCDate() < 10 ? `0${cD.getUTCDate()}`: cD.getUTCDate()) + `_`;
    fileName += cD.getUTCMonth() < 9 ? `0${cD.getUTCMonth() + 1}`: (cD.getUTCMonth() + 1);

    store.read(`users`).then(data => fs.writeFile(`./backups/${fileName}.json`, JSON.stringify(data), (err) => console.log(`Backed up data for [${fileName}].`)));
    store.write(`cooldowns/backup`, new Date());
    store.write(`logs/${new Date().getUTCMilliseconds()}`, `Backed up data.`);
}
module.exports.restore = async(filePath) => {
    let donors = Object.keys(require(`../../databases/donors.json`));

    let restoreData = {}
    fs.readFile(filePath, `utf-8`, (err, data) => {
        if(err) return console.error(err);
        let arr = JSON.parse(data);
        arr.forEach(user => {
            //Standardize NT account links
            let ntLink = `https://nitrotype.com/racer/`;
            if(user.nt_account.slice(0, 32) == `https://www.nitrotype.com/racer/`) ntLink += user.nt_account.slice(32);
            else if(user.nt_account.slice(0, 31) == `http://www.nitrotype.com/racer/`) ntLink += user.nt_account.slice(31);
            else if(user.nt_account.slice(0, 28) == `https://nitrotype.com/racer/`) ntLink += user.nt_account.slice(28);
            else if(user.nt_account.slice(0, 27) == `http://nitrotype.com/racer/`) ntLink += user.nt_account.slice(27);
            else return console.warn(`Could not determine [${user.usr_name}]'s NT account. User's account restoration was skipped.`);

            if(user.usr_name == `LeCashBot`) {
                return restoreData[user.usr_id] = {
                    balance: user.bal,
                    highestBet: {
                        chance: 0,
                        amount: 0
                    },
                    nt_account: user.nt_account,
                    messageCount: 0,
                    user: {
                        username: user.usr_name,
                        id: user.usr_id,
                        discriminator: user.tag.split(``).reverse().join(``).slice(0, 4).split(``).reverse().join(``)
                    }
                }
            }
            //Define data
            restoreData[user.usr_id] = {
                balance: user.bal,
                banned: false,
                highestBet: {
                    chance: user.bet.chances === null ? 0: user.bet.chances,
                    amount: user.bet.cost
                },
                cooldowns: {
                    commands: {
                        bet: 0,
                        daily: 0,
                        delete: new Date(),
                        coinflip: 0,
                        give: 0,
                        guess: 0,
                        report: 0,
                        suggest: 0,
                        withdraw: 0
                    },
                    getCash: 0
                },
                dailyStreak: user.daily_streak,
                donated: donors.includes(user.usr_name) ? true: false, //requires manual review
                messageCount: 0,
                ntAccount: ntLink,
                user: {
                    username: user.usr_name,
                    discriminator: user.tag.split(``).reverse().join(``).slice(0, 4).split(``).reverse().join(``),
                    id: user.usr_id
                }
            }
        });
        store.write(`users`, restoreData);
        store.write(`logs/${new Date().toUTCString()}`, `Restored data from file.`);
        console.log(`Succesfully restored data from file.`);
    });
}
module.exports.restoreV2 = async(filePath) => {
    let restoreData = {}
    fs.readFile(filePath, `utf-8`, (err, data) => {
        if(err) return console.error(err);
        store.write(`users`, JSON.parse(data));
        store.write(`logs/${new Date().getUTCMilliseconds()}`, `Restored data from v2 file.`);
        console.log(`Succesfully restored data from v2 file.`);
    });
}

module.exports.resetMessages = () => {
  store.read(`users`).then(data => {
    console.log(typeof data);
    let newUsers = {};
    for(let i in data) {
      newUsers[i] = data[i];
      newUsers[i].messageCount = 0;
    }
      store.write(`users`, newUsers);
      store.write(`cooldowns/resetMessages`, new Date());
  });
}