import { observer } from 'mobx-react-lite';
import Game from '../views/GameView';
import { useParams } from 'react-router-dom';



export default observer(
function GamePresenter(props){
    const { id } = useParams();


    if(id){
        props.model.games.fetchGameById(id);
    }

    
    if (!props.model.games.selectedGame || props.model.games.selectedGame.id !== Number(id)) {
    return <div>Loading game details...</div>; // Show loading until the game is fetched
    }


    return <Game game={props.model.games.selectedGame}/>;
    
})