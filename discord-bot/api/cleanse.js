module.exports.dbCleanse = str => {
    return str.replace(`<`, `&lt;`).replace(`>`, `&rt;`);
}
module.exports.discordCleanse = str => {
    return str.replace(`\`\`\``, `\\\`\\\`\\\``).replace(`\``, `\\\``).replace(`||`, `\\|\\|`).replace(`_`, `\\_`).replace(`***`, `\\*\\*\\*`).replace(`**`, `\\*\\*`).replace(`*`, `\\*`);
}