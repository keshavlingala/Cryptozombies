# CryptoZombies DApp

## Setup

### Installation

1. Clone the repository
2. Install the dependencies using `npm install`
3. Install [ganache](https://trufflesuite.com/ganache/) and add this project to workspace using `truffle-config.js` file
   in the root directory
4. Compile the contracts using `truffle compile`
5. Migrate the contracts using `truffle migrate`
6. Copy ZombieOwnership Deployed contract address and paste it in at src/constants.js
7. Install Metamask and connect to Ganache network using Ganache Network Details

        Network Name: Ganache
        New RPC URL: http://localhost:7545 
        Chain ID: 1337 
        Symbol: ETH

8. Copy private key of any account from Ganache except 1st one, and add new account in Metamask using private key
9. Run `npm run start` to start the front-end server (this will start the front-end server on port 3000 by default and
   opens the browser)
10. Connect Metamask to the front-end server by clicking on the Metamask icon in the browser
11. You can now create your own zombies and level them up
12. You can also change the name and DNA of your zombies
