import '/src/App.css'
import { observer } from 'mobx-react-lite';
import logo from '../assets/gibbrLogo.png';



function GameGrid(props) {
  const games = props.games;
  console.log("Games to render:", games);

  function InspectGameACB(gameId){
    window.location.hash = `#/game/${gameId}`;
  }

  return (
    <div>
      {games.map((game) => (
        <div className='gameContainer' onClick={() => InspectGameACB(game.id)}>
        <p>{game.title}</p>
        <img
          key={game.id}
          src={game.image}
          alt={game.title}
          style={{ width: '150px', height: '150px', objectFit: 'cover', margin: '8px' }}
        />
        </div>
      ))}
    </div>
  );
}

export default GameGrid;