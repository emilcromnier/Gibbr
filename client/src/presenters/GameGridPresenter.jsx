import { observer } from 'mobx-react-lite';
import GameGrid from '../views/GameGridView';



export default observer(


    
    
function GameGridPresenter(props){

    const trendingGames = props.model.games.trendingGames;
    const recentlyReleasedGames = props.model.games.recentGames;
    const topRatedGames = props.model.games.topRatedGames;
    console.log("TESTINGTESTING TESTING: ", trendingGames, recentlyReleasedGames, topRatedGames);




    return <GameGrid recentlyReleasedGames={recentlyReleasedGames} topRatedGames={topRatedGames} trendingGames = {trendingGames} />;
    
})