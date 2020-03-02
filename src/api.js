const Discord = require(`discord.js`);
const Math = require(`math.js`);
const { config, client } = require(`./index.js`);
const fs = require(`fs`);
const jsonstore = require(`jsonstore.io`);
let store = new jsonstore(config.jsonstoreToken);
const donors = require(`../databases/donors.json`);

module.exports = {
    cleanse: {
        discord: str => {
            return str.replace(`\`\`\``, `\\\`\\\`\\\``).replace(`\``, `\\\``).replace(`||`, `\\|\\|`).replace(`_`, `\\_`).replace(`***`, `\\*\\*\\*`).replace(`**`, `\\*\\*`).replace(`*`, `\\*`);
        },
        html: str => {
            return str.replace(`<`, `&lgt;`).replace(`>`, `&rgt;`);
        }
    },
    data: {
        backup: async(cD) => {
            let fileName = `${cD.getUTCFullYear()}_`;
            fileName += (cD.getUTCDate() < 10 ? `0${cD.getUTCDate()}`: cD.getUTCDate()) + `_`;
            fileName += cD.getUTCMonth() < 9 ? `0${cD.getUTCMonth() + 1}`: (cD.getUTCMonth() + 1);
        
            store.read(`logs`).then(data => fs.writeFile(`./backups/${fileName}.json`, JSON.stringify(data), (err) => console.log(`Backed up data for [${fileName}].`)));
            store.write(`cooldowns/backup`, new Date());
        },
        restore: async(filePath) => {
            let restoreData = {}
            fs.readFile(filePath, `utf-8`, (err, data) => {
                if(err) return console.error(err);
                store.write(`logs`, JSON.parse(data));
                console.log(`Succesfully restored data from file.`);
            });
        }
    },
    numbers: {
        standardize: int => {
            let a = 0;
            let mAT = ``;
            int.toString().split(``).reverse().forEach(n => {
                a += 1;
                mAT += ((a - 1) % 3) == 0 ? `,${n}`: n;
            });
            return mAT.slice(1).split(``).reverse().join(``);    
        }
    },
}