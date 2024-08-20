// components/PacMan.js
import React, { useState, useEffect } from 'react';
import './PacMan.css';

const PacMan = () => {
  const gridSize = 10;
  const initialPacManPosition = { x: 0, y: 0 };
  const [pacManPosition, setPacManPosition] = useState(initialPacManPosition);
  const [dots, setDots] = useState(generateDots());

  function generateDots() {
    const dotPositions = [];
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        dotPositions.push({ x: i, y: j });
      }
    }
    return dotPositions.filter(dot => dot.x !== 0 || dot.y !== 0); // Avoid placing dot at Pac-Man's initial position
  }

  const movePacMan = (x, y) => {
    setPacManPosition((prev) => {
      const newPosition = { x: prev.x + x, y: prev.y + y };

      // Boundaries check
      if (newPosition.x < 0 || newPosition.x >= gridSize || newPosition.y < 0 || newPosition.y >= gridSize) {
        return prev;
      }

      return newPosition;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          movePacMan(-1, 0);
          break;
        case 'ArrowDown':
          movePacMan(1, 0);
          break;
        case 'ArrowLeft':
          movePacMan(0, -1);
          break;
        case 'ArrowRight':
          movePacMan(0, 1);
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    // Check if Pac-Man is on a dot
    setDots((prevDots) => prevDots.filter(dot => !(dot.x === pacManPosition.x && dot.y === pacManPosition.y)));
  }, [pacManPosition]);

  return (
    <div className="pacman-game">
      <div className="grid">
        {Array.from({ length: gridSize }).map((_, row) => (
          <div key={row} className="row">
            {Array.from({ length: gridSize }).map((_, col) => (
              <div
                key={col}
                className={`cell ${pacManPosition.x === row && pacManPosition.y === col ? 'pacman' : ''}`}
              >
                {dots.find(dot => dot.x === row && dot.y === col) && <span className="dot"></span>}
              </div>
            ))}
          </div>
        ))}
      </div>
      {dots.length === 0 && <div className="game-over">You Win!</div>}
    </div>
  );
};

export default PacMan;
