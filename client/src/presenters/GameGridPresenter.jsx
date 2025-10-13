import { observer } from 'mobx-react-lite';
import GameGrid from '../views/GameGridView';



export default observer(


    
    
function GameGridPresenter(props){
    
    const games = props.model.games.trendingGames;

    const placeholderGames = [
    {
      id: 1,
      title: "Elden Ring",
      image: "https://via.placeholder.com/200x200.png?text=Elden+Ring",
    },
    {
      id: 2,
      title: "Zelda: Tears of the Kingdom",
      image: "https://via.placeholder.com/200x200.png?text=Zelda",
    },
    {
      id: 3,
      title: "Cyberpunk 2077",
      image: "https://via.placeholder.com/200x200.png?text=Cyberpunk",
    },
    {
      id: 4,
      title: "Hollow Knight",
      image: "https://via.placeholder.com/200x200.png?text=Hollow+Knight",
    },
  ];


    return <GameGrid games = {games} />;
    
})