import "/src/App.css";
import "/src/styles/GameGrid.css";
import { useState, useEffect } from "react";

function GameGrid(props) {
  const games = props.games;
  const [maxGames, setMaxGames] = useState(window.innerWidth <= 950 ? 3 : 6);

  useEffect(() => {
    function handleResize() {
      setMaxGames(window.innerWidth <= 950 ? 3 : 6);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function InspectGameACB(gameId) {
    window.location.hash = `#/game/${gameId}`;
  }

  return (
    <div>
      <div className="hero">
        {games.slice(0, 1).map((game) => (
          <div
            className="recommended-game"
            onClick={() => InspectGameACB(game.id)}
          >
            <img
              className="recommended-game__img"
              key={game.id}
              src={game.image}
              alt={game.title}
            />
          </div>
        ))}
        <div className="shortcuts">
          {games.slice(0, 4).map((game) => (
          <div
            className="shortcuts__container"
            onClick={() => InspectGameACB(game.id)}
          >
            <img
              className="shortcuts__container-img"
              key={game.id}
              src={game.image}
              alt={game.title}
            />
          </div>
        ))}
        </div>
      </div>

      <div className="carousel">
        {games.slice(1, 1 + maxGames).map((game) => (
          <div
            className="carousel__game"
            onClick={() => InspectGameACB(game.id)}
          >
            <img
              className="carousel__game-img"
              key={game.id}
              src={game.image}
              alt={game.title}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default GameGrid;
