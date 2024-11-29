// components/GamesDemo.js
import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const GamesDemo = () => {
    return (
        <div>
            <h1>Games Demo Page</h1>
            <ul>
                <li><Link to="pacman">Pac-Man</Link></li>
                <li><Link to="arkanoid">Arkanoid</Link></li>
                <li><Link to="game">Fighting Game</Link></li>
            </ul>
            <Outlet />
        </div>
    );
};

export default GamesDemo;