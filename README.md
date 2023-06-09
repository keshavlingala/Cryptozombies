# Midterm project: CryptoZombies DApp

## Team Token

[Repository Link](https://github.com/keshavlingala/Cryptozombies)

## Team Members

* Keshav Lingala (885187559) ( keshavlingala@csu.fullerton.edu )
* Saurabh Kudeti ( 885332130 ) ( kudeti1999@csu.fullerton.edu )
* Sri Vaishnavi Rudravallambi ( 885237289 ) ( srivaishnavi@csu.fullerton.edu )
* Priya Keshri ( 885191452 ) ( priyakeshri@csu.fullerton.edu )

## Project Description

This is a wrap up of what we learned form CryptoZombies. We have created a DApp that allows users to create their own
zombies. The DApp is deployed to Ganache and can be accessed at http://localhost:7545.

## Project Setup

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

## Improvements to the CryptoZombies DApp

1. Migrated front-end code to use ReactJS
2. HTML and JS code is moved to ReactJS components
3. Designed a modern UI to show multiple zombie cards
4. Allow users to create their zombies with custom names
5. Level up Zombie using a single button in Zombie Card
6. Zombies card are dynamically changed based on current user account
7. Change Name of Zombie ( must be Zombie level at least 2)
8. Change DNA of Zombie ( must be Zombie Level at least 20)
9. Added Autogenerated Images based on the name and ID of the zombie (used https://robohash.org/)
10. Conditional CSS based on the zombie's level 
11. Each User can create upto 6 zombies
12. Used Latest Metamask Web3 API to connect to Ganache
13. Used CryptoKitties API to show Kitties
14. Can copy address of kitty owner into clipboard
15. Pagination for Crypto kitties
16. Custom Script to fetch new and updated ABI from build folder to be used in front-end
