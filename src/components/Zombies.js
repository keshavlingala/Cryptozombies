import React, {useEffect, useRef, useState} from 'react';

import Web3 from "web3";
import {ETHEREUM_NETWORK, ZOMBIE_OWNERSHIP_CONTRACT_ADDRESS} from "../constants";
import {ABI} from "../lib/abi";

export const Zombies = () => {
    let [ownership, setOwnership] = useState(null)
    let [userAccount, setUserAccount] = useState('')
    let [zombies, setZombies] = useState([])
    const [status, setStatus] = useState('')
    const zombieName = useRef(null);

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
                console.log({web3, currentAccount, ABI, ownership})
                setOwnership(ownership);
            } catch (error) {
                setStatus('Please install MetaMask to use this application')
                console.error('Please install MetaMask to use this application', error);
            }
        }
    }

    useEffect(() => {
        handleLoad();
        return () => {
            setOwnership(null)
            setUserAccount('')
            setZombies([])
        }
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
        return () => {
            setZombies([])
        }
    }, [userAccount])

    // Show Clear text only for 5 seconds then clear
    useEffect(() => {
        const timer = setTimeout(() => {
            setStatus('');
        }, 3000);
        return () => clearTimeout(timer);
    }, [status])

    async function createZombie() {
        console.log('createZombie', zombieName.current.value)
        const name = zombieName.current.value;
        if (!name) {
            setStatus('Please enter a name for your zombie')
            return;
        }
        // Can only create 6 zombies per userAccount
        if (zombies.length >= 6) {
            setStatus('You can only create 6 zombies')
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

    const updateZombieName = async (zombieId, zombieLevel) => {
        // Only works for zombies with level 2 or higher
        if (zombieLevel < 2) {
            // Smooth Scroll to top
            window.scrollTo(0, 0);
            setStatus('Zombie level should be 2 or higher to update name')
            return;
        }
        const name = prompt('Enter new name for zombie', '')
        console.log('updateZombieName', zombieId, name)
        const transactionHash = await window.ethereum.request({
            method: 'eth_sendTransaction', params: [{
                from: userAccount,
                to: ZOMBIE_OWNERSHIP_CONTRACT_ADDRESS,
                data: ownership.methods.changeName(zombieId, name).encodeABI(),
            }]
        })
        console.log('Transaction Sent Successfully!', transactionHash)
        setStatus('Transaction Sent Successfully!')
        loadZombies();
    }

    const updateZombieDNA = async (zombieId, zombieLevel) => {
        // Only works for zombies with level 20 or higher
        if (zombieLevel < 20) {
            window.scrollTo(0, 0);
            setStatus('Zombie level should be 20 or higher to update DNA')
            return;
        }
        const dna = prompt('Enter new DNA for zombie', '')
        console.log('updateZombieDNA', zombieId, dna)
        const transactionHash = await window.ethereum.request({
            method: 'eth_sendTransaction', params: [{
                from: userAccount,
                to: ZOMBIE_OWNERSHIP_CONTRACT_ADDRESS,
                data: ownership.methods.changeDna(zombieId, dna).encodeABI(),
            }]
        })
        console.log('Transaction Sent Successfully!', transactionHash)
        setStatus('Transaction Sent Successfully!')
        loadZombies();
    }

    return (
        <div>
            <div className="container">
                <div className='status'>{status}</div>
                <div>
                    <input ref={zombieName} className='zombie-input' type="text" name='zombieName'
                           placeholder='Zombie Name'/>
                    <button onClick={() => createZombie()} id='createZombieButton' className='create-zombie-btn'>Create
                        Zombie
                    </button>
                </div>
            </div>
            <div className='zombie-wrapper'>
                {zombies.length && zombies.map((zombie) => {
                    // Style Card Based on Level
                    return (<div key={zombie.zombieId} className={'card level-' + Math.min(4, zombie.level)}>
                        <img src={`https://robohash.org/${zombie.zombieId+zombie.name}?set=set1`} alt='zombie'/>
                        <h2>Name: {zombie.name}</h2>
                        <h3>DNA: {zombie.dna}</h3>
                        <h4>Level: <b>{zombie.level}</b></h4>
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
                            <button className='btn update-zombie-name'
                                    onClick={() => updateZombieName(zombie.zombieId, zombie.level)}>Update Name
                            </button>
                            <button className='btn update-zombie-dna'
                                    onClick={() => updateZombieDNA(zombie.zombieId, zombie.level)}>Update DNA
                            </button>
                        </div>
                    </div>)
                })}
                {!zombies.length && <div className='no-zombies'>Create new Zombie to see Card</div>}
            </div>
        </div>
    )
}
