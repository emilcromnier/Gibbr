import { observer } from "mobx-react-lite";
import Game from "../views/GameView";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default observer(function GamePresenter(props) {
  const { id } = useParams();
  const userModel = props.model.user;
  const gamesModel = props.model.games;
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadGame() {
      if (!id) return;
      await gamesModel.fetchGameById(id);
     
    }
    loadGame();
  }, [id]);

  const game = gamesModel.selectedGame;
  const loading = gamesModel.loading;
  const user = userModel.currentUser;

  useEffect(() => {
    if (user) {
        userModel.fetchReviews(gamesModel);
    }
  }, [user]);

  if (loading || !game || !game.description || !game.released) {
    return <div>Loading game details...</div>;
  }

  // Use model helpers for clarity
  const isInWishlist = userModel.isInWishlist(game.slug);
  const existingReview = userModel.getReviewForGame(game.slug);

  async function onAddToWishlist(game) {
    if (!user) return;

    try {
      await userModel.addToWishlist(game);

    } catch (err) {
    }
  }

  async function onSubmitReview({ gameSlug, reviewText, rating }) {
    if (!user) return;

    try {
      await userModel.submitReview({ gameSlug, reviewText, rating });
 
    } catch (err) {
  
    }
  }

  async function onUpdateReview(reviewId, updatedData) {
    try {
      await userModel.updateReview(reviewId, updatedData);
    } catch (err) {
    
    }
  }

  async function onDeleteReview(reviewId) {
    try {
      await userModel.deleteReview(reviewId);
    } catch (err) {
      
    }
  }

  return (
    <Game
    user={user}
      game={game}
      existingReview={existingReview}
      isInWishlist={isInWishlist}
      onSubmitReview={onSubmitReview}
      onUpdateReview={onUpdateReview}
      onDeleteReview={onDeleteReview}
      onAddToWishlist={onAddToWishlist}
    />
  );
});
