import React, {useEffect, useRef, useState} from 'react';

import ReactDOM from 'react-dom/client';
import './lib/web3.min.js'
import './lib/styles.scss';

import {ETHEREUM_NETWORK, ZOMBIE_OWNERSHIP_CONTRACT_ADDRESS} from "./constants";
import {ABI} from "./lib/abi";
import Web3 from "web3";

function App() {
    let [ownership, setOwnership] = useState(null)
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
                    {zombies.length && zombies.map((zombie) => {
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
                    {!zombies.length && <div className='no-zombies'>Create new Zombie to see Card</div>}
                </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className='footer'>
                <path fill="#9c27b0" fill-opacity="1"
                      d="M0,64L36.9,224L73.8,128L110.8,64L147.7,96L184.6,256L221.5,128L258.5,224L295.4,192L332.3,160L369.2,64L406.2,192L443.1,96L480,64L516.9,32L553.8,128L590.8,64L627.7,288L664.6,32L701.5,192L738.5,288L775.4,96L812.3,64L849.2,288L886.2,256L923.1,256L960,128L996.9,0L1033.8,0L1070.8,192L1107.7,160L1144.6,192L1181.5,64L1218.5,96L1255.4,288L1292.3,64L1329.2,256L1366.2,256L1403.1,128L1440,128L1440,320L1403.1,320L1366.2,320L1329.2,320L1292.3,320L1255.4,320L1218.5,320L1181.5,320L1144.6,320L1107.7,320L1070.8,320L1033.8,320L996.9,320L960,320L923.1,320L886.2,320L849.2,320L812.3,320L775.4,320L738.5,320L701.5,320L664.6,320L627.7,320L590.8,320L553.8,320L516.9,320L480,320L443.1,320L406.2,320L369.2,320L332.3,320L295.4,320L258.5,320L221.5,320L184.6,320L147.7,320L110.8,320L73.8,320L36.9,320L0,320Z"></path>
            </svg>
        </div>

    );
}


ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
