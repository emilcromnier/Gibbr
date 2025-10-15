import '/src/App.css';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';

const Game = observer((props) => {
  const game = props.game;
  const user = props.user; // optional, pass currentUser if needed
  const existingReview = props.existingReview;
  const wishlist = props.wishlist || [];

  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5); // default rating 5
  const [submitting, setSubmitting] = useState(false);

  function handleAddToWishlist() {
    props.onAddToWishlist(game);
  }

  async function handleSubmitReview(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      await props.onSubmitReview({
        gameSlug: game.slug,
        reviewText,
        rating,
        completed: false,
        liked: false,
      });

      // Clear form
      setReviewText('');
      setRating(5);
    } catch (err) {
      console.error('Failed to submit review:', err);
      alert('Error submitting review');
    } finally {
      setSubmitting(false);
    }
  }

  // --- Check if game is in wishlist ---
  const inWishlist = wishlist.some((g) => g.slug === game.slug);

  return (
    <div className="game-details">
      <h1>{game.title}</h1>
      <img
        src={game.image}
        alt={game.title}
        style={{ width: '300px', borderRadius: '8px' }}
      />
      <p><strong>Released:</strong> {game.released}</p>
      <p>{game.description}</p>

      {/* --- Add to Wishlist button --- */}
      {!inWishlist && (
        <button onClick={handleAddToWishlist}>Add to Wishlist</button>
      )}

      {/* --- Existing review --- */}
      {existingReview ? (
        <div className="existing-review">
          <p>⭐ You gave this game {existingReview.rating}/5</p>
          <blockquote>“{existingReview.reviewText}”</blockquote>
        </div>
      ) : (
        // --- Review form if no review exists ---
        <div className="review-form">
          <h2>Submit a Review</h2>
          <form onSubmit={handleSubmitReview}>
            <div>
              <label>Rating:</label>
              {[1, 2, 3, 4, 5].map((num) => (
                <label key={num} style={{ margin: '0 5px' }}>
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

            <div style={{ marginTop: '10px' }}>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write your review here..."
                rows={4}
                style={{ width: '100%', padding: '5px' }}
              />
            </div>

            <button type="submit" disabled={submitting} style={{ marginTop: '10px' }}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
});

export default Game;
