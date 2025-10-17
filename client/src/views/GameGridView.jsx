import "/src/App.css";
import "/src/styles/GameGrid.css";
import { useState, useEffect } from "react";

function GameGrid(props) {
  const [maxGames, setMaxGames] = useState(window.innerWidth <= 950 ? 3 : 6);
  const trendingGames = props.trendingGames;
  const topRatedGames = props.topRatedGames;
  const recentlyReleasedGames = props.recentlyReleasedGames;

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
        {trendingGames.slice(0, 1).map((game) => (
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
          {topRatedGames.slice(0, 4).map((game) => (
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

      <h2>Trending</h2>
      <div className="carousel">
        {trendingGames.slice(0, maxGames).map((game) => (
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

      <h2>Top rated</h2>
      <div className="carousel">
        {topRatedGames.slice(0, maxGames).map((game) => (
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

      <h2>Recently released</h2>
      <div className="carousel">
        {recentlyReleasedGames.slice(0, maxGames).map((game) => (
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
