import "/src/App.css";
import { observer } from "mobx-react-lite";
import { useState } from "react";

const Game = observer(({ game, existingReview, isInWishlist, onAddToWishlist, onSubmitReview }) => {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmitReview(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmitReview({ gameSlug: game.slug, reviewText, rating });
      setReviewText("");
      setRating(5);
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

      {/* Wishlist */}
      {!isInWishlist ? (
        <button onClick={() => onAddToWishlist(game)}>Add to Wishlist</button>
      ) : (
        <p style={{ color: "gray" }}>✅ Already in Wishlist</p>
      )}

      {/* Review */}
      {existingReview ? (
        <div className="existing-review">
          <h3>Your Review</h3>
          <div><strong>Rating:</strong> {existingReview.rating}/5</div>
          {existingReview.reviewText && <p>{existingReview.reviewText}</p>}
        </div>
      ) : (
        <form onSubmit={handleSubmitReview} style={{ marginTop: "20px" }}>
          <h2>Submit a Review</h2>
          <div>
            <label>Rating:</label>
            {[1, 2, 3, 4, 5].map(num => (
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

          <textarea
            value={reviewText}
            onChange={e => setReviewText(e.target.value)}
            placeholder="Write your review..."
            rows={4}
            style={{ width: "100%", padding: "5px", marginTop: "10px" }}
          />

          <button type="submit" disabled={submitting} style={{ marginTop: "10px" }}>
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}
    </div>
  );
});

export default Game;
