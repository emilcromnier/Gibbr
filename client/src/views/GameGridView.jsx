import '/src/App.css'
import { observer } from 'mobx-react-lite';
import logo from '../assets/gibbrLogo.png';



function GameGrid(props) {
  const trendingGames = props.trendingGames;
  const topRatedGames = props.topRatedGames;
  const recentlyReleasedGames = props.recentlyReleasedGames;


  function InspectGameACB(gameId){
    window.location.hash = `#/game/${gameId}`;
  }

  return (
    <div>
    <div className='trendingGames-container'>
      <h1>Trending</h1>
      {trendingGames.map((game) => (
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

    <div className='topRated-container'>
      <h1>Top Rated</h1>
      {topRatedGames.map((game) => (
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

    <div className='recentGames-container'>
      <h1>Recently Released</h1>
      {recentlyReleasedGames.map((game) => (
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
    </div>
  );
}

export default GameGrid;