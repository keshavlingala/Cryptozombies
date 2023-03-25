import React from 'react';

import ReactDOM from 'react-dom/client';
import './lib/web3.min.js'
import './lib/styles.scss';
import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import {Zombies} from "./components/Zombies";
import {Kitties} from "./components/Kitties";


function App() {

    return (
        <div key='appID'>
            <BrowserRouter basename={'/'}>
                <div className="app-bar">
                    <h1><Link to="/">My Zombies</Link></h1>
                    <h1><Link to="/kitties" className='kitties-link'>Kitties</Link></h1>
                </div>
                <Routes>
                    <Route path="/" element={<Zombies/>}/>
                    <Route path="/kitties" element={<Kitties/>}/>
                </Routes>
            </BrowserRouter>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className='footer'>
                <path fill="#9c27b0"
                      d="M0,64L36.9,224L73.8,128L110.8,64L147.7,96L184.6,256L221.5,128L258.5,224L295.4,192L332.3,160L369.2,64L406.2,192L443.1,96L480,64L516.9,32L553.8,128L590.8,64L627.7,288L664.6,32L701.5,192L738.5,288L775.4,96L812.3,64L849.2,288L886.2,256L923.1,256L960,128L996.9,0L1033.8,0L1070.8,192L1107.7,160L1144.6,192L1181.5,64L1218.5,96L1255.4,288L1292.3,64L1329.2,256L1366.2,256L1403.1,128L1440,128L1440,320L1403.1,320L1366.2,320L1329.2,320L1292.3,320L1255.4,320L1218.5,320L1181.5,320L1144.6,320L1107.7,320L1070.8,320L1033.8,320L996.9,320L960,320L923.1,320L886.2,320L849.2,320L812.3,320L775.4,320L738.5,320L701.5,320L664.6,320L627.7,320L590.8,320L553.8,320L516.9,320L480,320L443.1,320L406.2,320L369.2,320L332.3,320L295.4,320L258.5,320L221.5,320L184.6,320L147.7,320L110.8,320L73.8,320L36.9,320L0,320Z"></path>
            </svg>
        </div>
    );
}


ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
