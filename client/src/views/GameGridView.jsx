import "/src/App.css";
import "/src/styles/GameGrid.css";

function GameGrid(props) {
  const games = props.games;
  console.log("Games to render:", games);

  function InspectGameACB(gameId) {
    window.location.hash = `#/game/${gameId}`;
  }

  return (
    <div className="game-grid">
      {games.map((game) => (
        <div
          className="game-grid__container"
          onClick={() => InspectGameACB(game.id)}
        >
          <p>{game.title}</p>
          <img
            className="game-grid__container-img"
            key={game.id}
            src={game.image}
            alt={game.title}
          />
        </div>
      ))}
    </div>
  );
}

export default GameGrid;
