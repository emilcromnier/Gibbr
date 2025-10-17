import '/src/App.css';
import '/src/styles/game.css';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';

const Game = observer((props) => {
  const game = props.game;
  const user = props.user;
  const existingReview = props.existingReview;
  const wishlist = props.wishlist || [];

  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const toggleDescription = () => { setShowFullDescription(!showFullDescription); };

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

      setReviewText('');
      setRating(5);
    } finally {
      setSubmitting(false);
    }
  }

  const inWishlist = wishlist.some((g) => g.slug === game.slug);

  return (
    <div className="game">
      <h1 className="game__title">{game.title}</h1>

      <div className="game__info">
        <div className="game__info--image">
          <img
            src={game.image}
            alt={game.title}
            className="game__image"
          />
          <p className="game__release">
            <strong>Released:</strong> {game.released}
          </p>
        </div>

        <div className="game__info--details">

          <div className={`game__description ${showFullDescription ? 'game__description--expanded' : ''}`}>
            <p>{game.description}</p>

            {!showFullDescription && (
              <button className="game__description--toggle" onClick={toggleDescription}>
                Read more
              </button>
            )}

            {showFullDescription && (
              <button className="game__description--toggle" onClick={toggleDescription}>
                Show less
              </button>
            )}
          </div>
        </div>
      </div>

      {!inWishlist && (
        <button className="game__wishlist--button" onClick={handleAddToWishlist}>
          Add to Wishlist
        </button>
      )}

      {existingReview ? (
        <div className="game__review game__review--existing">
          <p className="game__review--rating">⭐ You gave this game {existingReview.rating}/5</p>
          <blockquote className="game__review--text">“{existingReview.reviewText}”</blockquote>
        </div>
      ) : (
        <div className="game__review game__review--form">
          <h2 className="game__review--title">Submit a Review</h2>
          <form className="game__review--formcontainer" onSubmit={handleSubmitReview}>
            <div className="game__review--ratinginput">
              <label className="game__review--ratingoption">Rating:</label>
              {[1, 2, 3, 4, 5].map((num) => (
                <label key={num} style={{ margin: '0 5px' }}>
                  <input
                    type="radio"
                    name="rating"
                    value={num}
                    checked={rating === num}
                    onChange={() => setRating(num)}
                    className="game__review--ratingradio"
                  />
                  {num}
                </label>
              ))}
            </div>

            <div className="game__review--textinput">
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write your review here..."
                rows={4}
                className="game__review--textarea"
              />
            </div>

            <button type="submit" disabled={submitting} className="game__review--submit">
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
});

export default Game;