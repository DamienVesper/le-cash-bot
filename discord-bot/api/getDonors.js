const donors = require(`../../databases/donors.json`);
const moneyAPI = require(`./money.js`);
const cleanseAPI = require(`./cleanse.js`);

let donorText = ``;
for(let i in donors) {
    donorText +=  `${i} - $${moneyAPI.standardize(donors[i])}\n`;
}

module.exports = donorText;