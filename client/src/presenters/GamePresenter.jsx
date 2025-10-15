import { observer } from "mobx-react-lite";
import Game from "../views/GameView";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

export default observer(function GamePresenter(props) {
  const { id } = useParams();
  const userModel = props.model.user;
  const gamesModel = props.model.games;

  useEffect(() => {
    if (id) gamesModel.fetchGameById(id);
  }, [id]);

  const game = gamesModel.selectedGame;
  const user = userModel.currentUser;

  useEffect(() => {
    if (user) userModel.fetchReviews(gamesModel);
  }, [user]);

  if (!game || game.id !== Number(id)) {
    return <div>Loading game details...</div>;
  }

  // --- FIND EXISTING REVIEW ---
  const existingReview = userModel.reviews.find(
    (r) =>
      r.gameSlug?.toLowerCase().replace(/[^a-z0-9]/g, "") ===
      game.slug?.toLowerCase().replace(/[^a-z0-9]/g, "")
  );

  console.log("Game slug:", game.slug);
  console.log("Existing review found:", existingReview);

  function onAddToWishlist(game) {
    if (!user) {
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
    if (!user) {
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
      existingReview={existingReview}
      onSubmitReview={onSubmitReview}
      onAddToWishlist={onAddToWishlist}
    />
  );
});
