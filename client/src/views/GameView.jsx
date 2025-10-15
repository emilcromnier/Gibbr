import "/src/App.css";
import { observer } from "mobx-react-lite";
import { useState } from "react";

const Game = observer((props) => {
  const { game, onAddToWishlist, onSubmitReview, isInWishlist } = props;
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  function handleAddToWishlist() {
    onAddToWishlist(game);
  }

  async function handleSubmitReview(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      await onSubmitReview({
        gameSlug: game.slug,
        reviewText,
        rating,
        completed: false,
        liked: false,
      });
      setReviewText("");
      setRating(5);
    } catch (err) {
      alert("Error submitting review");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="game-details">
      <h1>{game.title}</h1>
      <img
        src={game.image}
        alt={game.title}
        style={{ width: "300px", borderRadius: "8px" }}
      />
      <p><strong>Released:</strong> {game.released}</p>
      <p>{game.description}</p>

      {/* 👇 Only show if NOT in wishlist */}
      {!isInWishlist && (
        <button onClick={handleAddToWishlist}>Add to Wishlist</button>
      )}

      <h2>Submit a Review</h2>
      <form onSubmit={handleSubmitReview}>
        <div>
          <label>Rating:</label>
          {[1, 2, 3, 4, 5].map((num) => (
            <label key={num} style={{ margin: "0 5px" }}>
              <input
                type="radio"
                name="rating"
                value={num}
                checked={rating === num}
                onChange={() => setRating(num)}
              />
              {num}
            </label>
          ))}
        </div>

        <div style={{ marginTop: "10px" }}>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review here..."
            rows={4}
            style={{ width: "100%", padding: "5px" }}
          />
        </div>

        <button type="submit" disabled={submitting} style={{ marginTop: "10px" }}>
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
});

export default Game;
