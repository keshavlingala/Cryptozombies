import React, {useEffect, useState} from 'react';
import {CRYPTO_KITTIES} from "../constants";

export const Kitties = () => {
    const [kitties, setKitties] = useState([]);
    const [status, setStatus] = useState('');
    const [offset, setOffset] = useState(0);

    // Clear the status after 3 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setStatus('');
        }, 3000);
        return () => clearTimeout(timer);
    }, [status])

    useEffect(() => {
        console.log('offset', offset)
        fetch(CRYPTO_KITTIES + '&offset=' + offset)
            .then(res => res.json())
            .then(data => {
                console.log('new kitties', data.kitties);
                setKitties(data.kitties)
            });
    }, [offset])

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
            <div className="container">
                <div className='btn-wrapper btn-center'>
                    <button className='btn btn-prev' onClick={() => setOffset(offset - 8)}
                            disabled={offset === 0}>Previous
                    </button>
                    <span className='page-no'>page: {offset / 8 + 1}</span>
                    <button className='btn btn-next' onClick={() => setOffset(offset + 8)}
                            disabled={kitties.length < 8}>Next
                    </button>
                </div>
            </div>
        </div>
    )
}
