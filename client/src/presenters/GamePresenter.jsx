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

    async function onSubmitReview({ gameSlug, reviewText, rating }) {
    if (!userModel.currentUser) {
      alert("You must be logged in to submit a review.");
      return;
    }

    try {
      // Optional: you could track submission/loading state here
      console.log("PRESENTER:", gameSlug, reviewText, rating);
      await userModel.submitReview({gameSlug, reviewText, rating}); // <-- model handles API call
      alert("Review submitted successfully!");
    } catch (err) {
      alert(`Failed to submit review: ${err.message}`);
    }
  }


    if (id) {


        
    props.model.games.fetchGameById(id);
        
   
    }

    
    if (!props.model.games.selectedGame || props.model.games.selectedGame.id !== Number(id)) {
    return <div>Loading game details...</div>; // Show loading until the game is fetched
    }


    return <Game onSubmitReview={onSubmitReview} onAddToWishlist={onAddToWishlist} game={props.model.games.selectedGame}/>;
    
})