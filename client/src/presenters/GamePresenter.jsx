import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default observer(function GamePresenter(props) {
  const { id } = useParams();
  const userModel = props.model.user;
  const gamesModel = props.model.games;

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadGame() {
      console.log("🔄 useEffect triggered for id:", id);
      if (!id) return;
      setIsLoaded(false);
      await gamesModel.fetchGameById(id); 
      setIsLoaded(true);
    }
    loadGame();
  }, [id]);

  const game = gamesModel.selectedGame;

  //Fetch game when ID changes
  useEffect(() => {
    if (!id) return;

    // Optional: clear old game immediately
    gamesModel.selectedGame = null;

    gamesModel.fetchGameById(id);
  }, [id]);

  if (!isLoaded || !game) {
    return <div>Loading game details...</div>;
  }

  // Check if the game is in the wishlist
  const isInWishlist =
    userModel.wishlist?.some(
      (g) => g.slug === game.slug || g.id === game.id
    ) || false;

  function onAddToWishlist(game) {
    if (!userModel.currentUser) {
      alert("You must be logged in to add games to your wishlist.");
      return;
    }

    const username = userModel.currentUser?.username;
    const token = userModel.token;

    userModel
      .addToWishlist(game, username, token)
      .then(() => alert(`${game.title} added to wishlist!`))
      .catch((err) => alert(`Failed to add to wishlist: ${err.message}`));
  }

  async function onSubmitReview({ gameSlug, reviewText, rating }) {
    if (!userModel.currentUser) {
      alert("You must be logged in to submit a review.");
      return;
    }

    try {
      await userModel.submitReview({ gameSlug, reviewText, rating });
      alert("Review submitted successfully!");
    } catch (err) {
      alert(`Failed to submit review: ${err.message}`);
    }
  }

  return (
    <Game
      game={game}
      onAddToWishlist={onAddToWishlist}
      onSubmitReview={onSubmitReview}
      isInWishlist={isInWishlist}
    />
  );
});
