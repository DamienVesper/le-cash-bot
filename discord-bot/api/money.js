module.exports.standardize = moneyInt => {
    let a = 0;
    let mAT = ``;
    moneyInt.toString().split(``).reverse().forEach(n => {
        a += 1;
        mAT += ((a - 1) % 3) == 0 ? `,${n}`: n;
    });
    return mAT.slice(1).split(``).reverse().join(``);
}