import { observer } from "mobx-react-lite";
import Game from "../views/GameView";
import { useParams } from "react-router-dom";

export default observer(function GamePresenter(props) {
  const { id } = useParams();
  const userModel = props.model.user;
  const game = props.model.games.selectedGame;

  if (id && (!game || game.id !== Number(id))) {
    props.model.games.fetchGameById(id);
  }

  if (!game) {
    return <div>Loading game details...</div>;
  }

  // ✅ Check if this game (by slug or id) is in the wishlist
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
      isInWishlist={isInWishlist} // 👈 pass it down
    />
  );
});
