// src/components/GamesDemo.js
import React from 'react';
import { Link } from 'react-router-dom';
import './GamesDemo.css';

function GamesDemo() {
  return (
    <div className="section games-demo">
      <div className="section-header">
        <h1>Games Demo</h1>
        <p>Experience AI-driven gaming innovation.</p>
      </div>
      <div className="demo-content">
        <div className="demo-card">
          <h2>Pac-Man AI</h2>
          <p>Play Pac-Man with AI enhancements.</p>
          <Link to="pacman" className="demo-button">Play Pac-Man</Link>
        </div>
        <div className="demo-card">
          <h2>Arkanoid AI</h2>
          <p>Enjoy Arkanoid with advanced AI features.</p>
          <Link to="arkanoid" className="demo-button">Play Arkanoid</Link>
        </div>
        <div className="demo-card">
          <h2>Fighting Game AI</h2>
          <p>Experience our AI-powered fighting game.</p>
          <Link to="game" className="demo-button">Play Fighting Game</Link>
        </div>
      </div>
    </div>
  );
}

export default GamesDemo;