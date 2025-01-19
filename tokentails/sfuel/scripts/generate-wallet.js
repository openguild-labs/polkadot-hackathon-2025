const { Wallet } = require('ethers');
const crypto = require('crypto');

function generateWallet() {
    const id = crypto.randomBytes(32).toString('hex');
    const privateKey = '0x' + id;
    const wallet = new Wallet(privateKey);

    return {
        address: wallet.address,
        privateKey,
    };
}

console.log(generateWallet());
