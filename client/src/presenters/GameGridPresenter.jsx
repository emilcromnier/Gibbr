import { observer } from 'mobx-react-lite';
import GameGrid from '../views/GameGridView';



export default observer(


    
    
function GameGridPresenter(props){

    const games = props.model.games.trendingGames;




    return <GameGrid games = {games} />;
    
})