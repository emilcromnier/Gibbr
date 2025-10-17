import { observer } from "mobx-react-lite";
import Game from "../views/GameView";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default observer(function GamePresenter({ model }) {
  const { id } = useParams();
  const userModel = model.user;
  const gamesModel = model.games;
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadGame() {
      if (!id) return;
      setIsLoaded(false);
      await gamesModel.fetchGameById(id);
      setIsLoaded(true);
    }
    loadGame();
  }, [id]);

  const game = gamesModel.selectedGame;
  const user = userModel.currentUser;

  useEffect(() => {
    if (user) userModel.fetchMyReviews(gamesModel);
  }, [user]);

  if (!isLoaded || !game) {
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

  return (
    <Game
      game={game}
      existingReview={existingReview}
      isInWishlist={isInWishlist}
      onSubmitReview={onSubmitReview}
      onAddToWishlist={onAddToWishlist}
    />
  );
});
