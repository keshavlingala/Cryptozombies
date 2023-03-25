import React, {useEffect, useState} from 'react';
import {CRYPTO_KITTIES} from "../constants";

export const Kitties = () => {
    const [kitties, setKitties] = useState([]);
    const [status, setStatus] = useState('');

    // Clear the status after 3 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setStatus('');
        }, 3000);
        return () => clearTimeout(timer);
    }, [status])

    useEffect(() => {
        fetch(CRYPTO_KITTIES)
            .then(res => res.json())
            .then(data => {
                setKitties(data.kitties)
            });
    }, [])

    function copyToClipboard(address) {
        navigator.clipboard.writeText(address).then(
            () => setStatus('Copied to clipboard')
        )
    }

    return (
        <div>
            <div className="status">{status}</div>
            <div className='kitties-wrapper'>
                {kitties.length > 0 && kitties.map(kitty => (
                        <div key={kitty.id} className='kitty-card'>
                            <img src={kitty.image_url_cdn} alt=""/>
                            <h2>{kitty.name}</h2>
                            <span>Owner Address: <code onClick={() => copyToClipboard(kitty.owner.address)}
                                                       title={kitty.owner.address}>{kitty.owner.address.slice(0, 20)}...</code></span>
                            <span>Generation: {kitty.generation}</span>
                            <span>Color: {kitty.color}</span>
                            <span>Eye Color: {kitty.eye_color}</span>
                            <span>Birthday: {new Date(kitty.birthday).toLocaleDateString()}</span>

                        </div>
                    )
                )}
                {kitties.length === 0 && <div className='loading'>Loading...</div>}
            </div>
        </div>
    )
}
