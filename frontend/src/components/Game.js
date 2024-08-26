// components/Game.js
import React, { useState, useEffect } from 'react';
import './Game.css';

const Game = () => {
  const [player1Position, setPlayer1Position] = useState({ top: 50, left: 10 });
  const [player2Position, setPlayer2Position] = useState({ top: 50, left: 80 });
  const [player1Health, setPlayer1Health] = useState(100);
  const [player2Health, setPlayer2Health] = useState(100);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState('');

  const handleKeyDown = (e) => {
    if (gameOver) return;

    // Player 1 controls
    if (e.key === 'w') setPlayer1Position(prev => ({ ...prev, top: Math.max(prev.top - 5, 0) }));
    if (e.key === 's') setPlayer1Position(prev => ({ ...prev, top: Math.min(prev.top + 5, 80) }));
    if (e.key === 'a') setPlayer1Position(prev => ({ ...prev, left: Math.max(prev.left - 5, 0) }));
    if (e.key === 'd') setPlayer1Position(prev => ({ ...prev, left: Math.min(prev.left + 5, 80) }));

    // Player 2 controls
    if (e.key === 'ArrowUp') setPlayer2Position(prev => ({ ...prev, top: Math.max(prev.top - 5, 0) }));
    if (e.key === 'ArrowDown') setPlayer2Position(prev => ({ ...prev, top: Math.min(prev.top + 5, 80) }));
    if (e.key === 'ArrowLeft') setPlayer2Position(prev => ({ ...prev, left: Math.max(prev.left - 5, 20) }));
    if (e.key === 'ArrowRight') setPlayer2Position(prev => ({ ...prev, left: Math.min(prev.left + 5, 100) }));

    // Player 1 attack
    if (e.key === 'f') checkCollision(player1Position, player2Position, setPlayer2Health);

    // Player 2 attack
    if (e.key === 'Enter') checkCollision(player2Position, player1Position, setPlayer1Health);
  };

  const checkCollision = (attacker, defender, setHealth) => {
    if (
      attacker.left < defender.left + 10 &&
      attacker.left + 10 > defender.left &&
      attacker.top < defender.top + 10 &&
      attacker.top + 10 > defender.top
    ) {
      setHealth(prev => Math.max(prev - 10, 0));
    }
  };

  useEffect(() => {
    if (player1Health <= 0) {
      setGameOver(true);
      setWinner('Player 2');
    } else if (player2Health <= 0) {
      setGameOver(true);
      setWinner('Player 1');
    }
  }, [player1Health, player2Health]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="game-container">
      {gameOver ? (
        <div className="game-over">
          <h2>Game Over!</h2>
          <p>{winner} Wins!</p>
        </div>
      ) : (
        <>
          <div
            className="player player1"
            style={{ top: `${player1Position.top}%`, left: `${player1Position.left}%` }}
          ></div>
          <div
            className="player player2"
            style={{ top: `${player2Position.top}%`, left: `${player2Position.left}%` }}
          ></div>
          <div className="health-bar player1-health">
            <span style={{ width: `${player1Health}%` }}></span>
          </div>
          <div className="health-bar player2-health">
            <span style={{ width: `${player2Health}%` }}></span>
          </div>
        </>
      )}
    </div>
  );
};

export default Game;

