// get all json files in the build/contracts folder
const fs = require('fs');
const path = require('path');
const contractPath = path.resolve('/Users/keshav/Favs/Masters/Blockchain/CryptozombieMidTermProject/build/contracts');
const files = fs.readdirSync(contractPath);
let abi = []
const contracts = files.filter(f => f.endsWith('.json')).map(f => {
    const contract = require(path.resolve(contractPath, f));
    abi.push(...contract.abi);
});

// write abi variable to js file
fs.writeFile('src/lib/abi.js', 'export const ABI = ' + JSON.stringify(abi), function (err) {
    if (err) throw err;
    console.log('Saved!');
});

