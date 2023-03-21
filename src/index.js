import React, {useEffect, useRef, useState} from 'react';

import ReactDOM from 'react-dom/client';
import './lib/web3.min.js'
import './lib/styles.scss';

import {ETHEREUM_NETWORK, ZOMBIE_FEEDING_CONTRACT_ADDRESS, ZOMBIE_OWNERSHIP_CONTRACT_ADDRESS} from "./constants";
import {ABI} from "./lib/abi";
import Web3 from "web3";

function App() {
    let [ownership, setOwnership] = useState(null)
    let [feeding, setFeeding] = useState(null)
    let [userAccount, setUserAccount] = useState('')
    let [zombies, setZombies] = useState([])
    const [status, setStatus] = useState('')
    const zombieName = useRef(null);

    useEffect(() => {
        window.addEventListener('load', handleLoad);

        async function handleLoad() {
            if (window.ethereum) {
                try {
                    await window.ethereum.request({method: 'eth_requestAccounts'});
                    const accounts = await window.ethereum.request({method: 'eth_accounts'});
                    const currentAccount = accounts[0];
                    console.log('currentAccount', currentAccount)
                    setUserAccount(currentAccount)
                    const web3 = new Web3(ETHEREUM_NETWORK);
                    window.web3 = web3;
                    const ownership = new web3.eth.Contract(ABI, ZOMBIE_OWNERSHIP_CONTRACT_ADDRESS);
                    const feeding = new web3.eth.Contract(ABI, ZOMBIE_FEEDING_CONTRACT_ADDRESS);
                    setFeeding(feeding);
                    setOwnership(ownership);

                } catch (error) {
                    setStatus(error)
                    console.error('Please install MetaMask to use this application', error);
                }
            }
        }

        return () => window.removeEventListener('load', handleLoad);
    }, []);

    async function loadZombies() {
        if (ownership) {
            ownership.events.Transfer({filter: {from: userAccount}})
                .on('data', function (event) {
                    console.log(event);
                })
            const zombies = await ownership.methods.getZombiesByOwner(userAccount).call();
            console.log('zombies', zombies)

            const zombiesData = await Promise.all(zombies.map(async (zombieId) => {
                const item = await ownership.methods.zombies(zombieId).call()
                return {
                    zombieId, ...item
                }
            }))
            console.log('zombiesData', zombiesData)
            setZombies(zombiesData)
        }
    }

    useEffect(() => {
        loadZombies();
    }, [userAccount])

    // Show Clear text only for 5 seconds then clear
    useEffect(() => {
        if (status) {
            setTimeout(() => {
                setStatus('')
            }, 5000)
        }
    }, [status])

    async function createZombie() {
        console.log('createZombie', zombieName.current.value)
        const name = zombieName.current.value;
        if (!name) {
            setStatus('Please enter a name for your zombie')
            return;
        }
        const gas = await ownership.methods.createRandomZombie(name).estimateGas({from: userAccount});
        console.log('gas', gas)
        const receipt = await ownership.methods.createRandomZombie(name).send({from: userAccount, gas});
        console.log('receipt', receipt)
        zombieName.current.value = ''
        setStatus('Zombie Created Successfully')
        loadZombies();
    }

    const levelUpZombie = async (zombieId) => {
        console.log('levelUpZombie', zombieId)
        const gasLimit = 300000; // Increase this value if needed
        const transactionHash = await window.ethereum.request({
            method: 'eth_sendTransaction', params: [{
                from: userAccount,
                to: ZOMBIE_OWNERSHIP_CONTRACT_ADDRESS,
                value: web3.utils.toHex(
                    web3.utils.toWei("0.001", "ether")
                ),
                data: ownership.methods.levelUp(zombieId).encodeABI(),
                gasLimit: web3.utils.toHex(gasLimit)
            }]
        })
        console.log('Transaction Sent Successfully!', transactionHash)
        setStatus('Transaction Sent Successfully!')
        loadZombies();
    }

    const deleteZombie = async (zombieID) => {
        console.log('deleteZombie', zombieID)
        // deleteZombie
        const gas = await ownership.methods.deleteZombie(zombieID).estimateGas({from: userAccount});
        console.log('gas', gas)
        const receipt = await ownership.methods.deleteZombie(zombieID).send({from: userAccount, gas});
        console.log('receipt', receipt)
        setStatus('Zombie Deleted Successfully')
        loadZombies();
    }

    return (<div key='appID'>
            <div className="app-bar">
                <h1>My Zombies</h1>
                <div>
                    <input ref={zombieName} className='zombie-input' type="text" name='zombieName'
                           placeholder='Zombie Name'/>
                    <button onClick={() => createZombie()} id='createZombieButton' className='create-zombie-btn'>Create
                        Zombie
                    </button>
                </div>
            </div>
            <div className='container'>
                <div className='status'>{status}</div>
                <div className='zombie-wrapper'>
                    {zombies.map((zombie) => {
                        // Style Card Based on Level
                        return (<div key={zombie.zombieId} className={'card level-' + zombie.level}>
                            <img src={`https://robohash.org/${zombie.zombieId}?set=set1`} alt='zombie'/>
                            <h2>Name: {zombie.name}</h2>
                            <span>DNA: {zombie.dna}</span>
                            <span>Level: {zombie.level}</span>
                            <span>Wins: {zombie.winCount}</span>
                            <span>Losses: {zombie.lossCount}</span>
                            <span>Ready Time: {new Date(+(zombie.readyTime + '000')).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</span>
                            <div className="btn-wrapper">
                                <button className='btn level-up-btn'
                                        onClick={() => levelUpZombie(zombie.zombieId)}>Level Up
                                </button>
                            </div>
                        </div>)
                    })}
                </div>
            </div>
        </div>

    );
}


ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
