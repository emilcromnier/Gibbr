import '/src/App.css';
import '/src/styles/game.css';
import { observer } from 'mobx-react-lite';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import backArrow from '../assets/backArrow.svg';

const Game = observer((props) => {
  const game = props.game;
  const user = props.user;
  const existingReview = props.existingReview;
  const wishlist = props.wishlist || [];
  const descriptionRef = useRef(null);

  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [wishlistToast, setWishlistToast] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  useEffect(() => {
    if (descriptionRef.current) {
      const { scrollHeight, clientHeight } = descriptionRef.current;
      setIsOverflowing(scrollHeight > clientHeight + 5);
    }
  }, [game.description]);

  useEffect(() => {
    if (existingReview) {
      setReviewText(existingReview.reviewText || '');
      setRating(existingReview.rating || 5);
    }
  }, [existingReview]);

  async function handleAddToWishlist() {
    if (!props.onAddToWishlist || !game) return;
    try {
      await props.onAddToWishlist(game);
      setWishlistToast(true);
      setTimeout(() => setWishlistToast(false), 2200);
    } catch (e) {
      console.error("Add to wishlist failed:", e);
    }
  }

  async function handleSubmitReview(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEditing && existingReview) {
        await props.onUpdateReview(existingReview.reviewId, { reviewText, rating });
        setIsEditing(false);
      } else {
        await props.onSubmitReview({
          gameSlug: game.slug,
          reviewText,
          rating,
          completed: false,
          liked: false,
        });
      }
      setReviewText('');
      setRating(5);
    } catch (err) {
      console.error('Failed to submit review:', err);
      alert('Error submitting review');
    } finally {
      setSubmitting(false);
    }
  }

  // --- Delete Review ---
  async function handleDeleteReview() {
    if (existingReview && props.onDeleteReview) {
      try {
        await props.onDeleteReview(existingReview.reviewId);
      } catch (err) {
        console.error("Failed to delete review:", err);
      }
    }
  }

  const inWishlist = wishlist.some((g) => g.slug === game.slug);
  return (
    <div className="game">
      <button onClick={() => window.history.back()} className='back-button'>
        <img src={backArrow} alt="Back" className='back-button__arrow'/>
      </button>
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
          <div
            ref={descriptionRef}
            className={`game__description ${showFullDescription ? 'game__description--expanded' : ''}`}
          >
            <p>{game.description}</p>

            {isOverflowing && !showFullDescription && (
              <button className="game__description--toggle" onClick={toggleDescription}>
                Read more
              </button>
            )}

            {isOverflowing && showFullDescription && (
              <button className="game__description--toggle" onClick={toggleDescription}>
                Show less
              </button>
            )}
          </div>
        </div>
      </div>

      {!inWishlist && user && (
        <div className="game__wishlist">
          <button className="game__wishlist--button" onClick={handleAddToWishlist}>
            Add to Wishlist
          </button>

          <AnimatePresence>
            {wishlistToast && (
              <motion.div
                className="game__wishlist--toast"
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.97 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
              Added to wishlist
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      

      {existingReview && !isEditing ? (
        <div className="game__review game__review--existing">
          <p className="game__review--rating">
            ⭐ You gave this game {existingReview.rating}/5
          </p>
          <blockquote className="game__review--text">
            “{existingReview.reviewText}”
          </blockquote>
          <div className="game__review--actions">
            <button onClick={() => setIsEditing(true)} className="reviewbtn--primary">
              Edit Review
            </button>
            <button
              onClick={handleDeleteReview}
              className="reviewbtn--secondary"
              style={{ backgroundColor: 'red', color: 'white' }}
            >
              Delete Review
            </button>
          </div>
        </div>
      ) : (
        user && (
          <div className="game__review game__review--form">
            <h2 className="game__review--title">
              {isEditing ? 'Edit Your Review' : 'Submit a Review'}
            </h2>
            <form
              className="game__review--formcontainer"
              onSubmit={handleSubmitReview}
            >
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

              <div className="game__review--buttons">
                <button
                  type="submit"
                  disabled={submitting}
                  className="game__review--submit"
                >
                  {submitting
                    ? 'Saving...'
                    : isEditing
                    ? 'Update Review'
                    : 'Submit Review'}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    className="game__review--cancel"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )
      )}
    </div>
  );
});

export default Game;