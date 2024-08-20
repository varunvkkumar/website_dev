// components/Game.js
import React, { useState, useEffect } from 'react';
import './Game.css'; // Create a CSS file for styling

const Game = () => {
  const [boxPosition, setBoxPosition] = useState({ top: '50%', left: '50%' });
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds timer

  useEffect(() => {
    const interval = setInterval(() => {
      setBoxPosition({
        top: `${Math.floor(Math.random() * 90)}%`,
        left: `${Math.floor(Math.random() * 90)}%`,
      });
    }, 1000); // Move the box every 1 second

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000); // Countdown timer

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, []);

  const handleClick = () => {
    setScore(score + 1);
  };

  return (
    <div className="game-container">
      {timeLeft > 0 ? (
        <>
          <div
            className="game-box"
            style={{ top: boxPosition.top, left: boxPosition.left }}
            onClick={handleClick}
          ></div>
          <div className="game-info">
            <p>Score: {score}</p>
            <p>Time Left: {timeLeft} seconds</p>
          </div>
        </>
      ) : (
        <div className="game-over">
          <h2>Game Over!</h2>
          <p>Your final score is {score}</p>
        </div>
      )}
    </div>
  );
};

export default Game;
