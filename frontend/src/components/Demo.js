// components/Demo.js
import React from 'react';
import { Link } from 'react-router-dom';

const Demo = () => {
    return (
        <div>
            <h1>Demo Page</h1>
            <ul>
                <li><Link to="/demo/ecommerce">Ecommerce Demo</Link></li>
                <li><Link to="/demo/games">Games Demo</Link></li>
            </ul>
        </div>
    );
};

export default Demo;