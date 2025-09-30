import React from 'react';


function Main() {
  // Placeholder array, later this will come from API and the Redux store
  const games = [
    { id: 1, title: 'Game 1' },
    { id: 2, title: 'Game 2' },
    { id: 3, title: 'Game 3' },
    { id: 4, title: 'Game 4' }
  ];

  return (
    <div className="main-container">
      <h1>Games</h1>
      <div className="games-grid">
        {games.map((game) => (
          <div key={game.id} className="game-card">
            <p>{game.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Main;