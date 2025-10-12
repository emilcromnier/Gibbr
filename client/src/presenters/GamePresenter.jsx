import { observer } from 'mobx-react-lite';
import Game from '../views/GameView';
import { useParams } from 'react-router-dom';



export default observer(
function GamePresenter(props){
    const { id } = useParams();
    const userModel = props.model.user;

    function onAddToWishlist(game){
        

        if (!userModel.currentUser) {
            alert("You must be logged in to add games to your wishlist.");
            return;
        }

        const username = userModel.currentUser.username;
        const token = userModel.token;
        console.log("GAMEOBJECT", game)

        userModel
            .addToWishlist(game, username, token)
            .then(() => {
            alert(`${game.title} added to wishlist!`);
            })
            .catch((err) => {
            alert(`Failed to add to wishlist: ${err.message}`);
            });

    }



    if(id){
        props.model.games.fetchGameById(id);
    }

    
    if (!props.model.games.selectedGame || props.model.games.selectedGame.id !== Number(id)) {
    return <div>Loading game details...</div>; // Show loading until the game is fetched
    }


    return <Game onAddToWishlist={onAddToWishlist} game={props.model.games.selectedGame}/>;
    
})