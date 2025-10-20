import "/src/App.css";
import "/src/styles/profile.css";
import { observer } from "mobx-react-lite";
import { useState } from "react";

function Profile(props) {
  //to avoid too many props.whatever
  const { username, description, wishlist, reviews, onRemoveFromWishlist, onUpdateReview, onRemoveReview } = props;

  function InspectGameACB(gameId) {
    window.location.hash = `#/game/${gameId}`;
  }

  return (
    <div className="profile">
      <div className="profile__header">
        <h1>{username}</h1>
      </div>

      <div className="profile__main--content">
        <div className="profile__reviews">
          <h1 className="profile__section--title">Recent Reviews</h1>
          <ul className="profile__reviews--list">
            {reviews.map((review) => {
              const game = review.gameDetails;
              return (
                <EditableReviewItem
                  key={review.reviewId || review._id}
                  review={review}
                  game={game}
                  onUpdateReview={onUpdateReview}
                  onRemoveReview={onRemoveReview}
                />
              );
            })}
          </ul>
        </div>
      </div>

      <div className="profile__wishlist">
        <h1 className="profile__wishlist--title">Wishlist</h1>
        <div className="profile__wishlist--carousel">
          {wishlist.map((game) => (
            <div
              key={game.id}
              className="profile__wishlist--item"
              onClick={() => InspectGameACB(game.id)}
            >
              <img src={game.image} alt={game.title} className="profile__wishlist--image" />
              <p className="profile__wishlist--gametitle">{game.title}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFromWishlist(game);
                }}
                className="profile__wishlist--remove"
              >
                Remove from Wishlist
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Editable review item ---
const EditableReviewItem = observer((props) => {
  const { review, game, onUpdateReview, onRemoveReview } = props;  //just to avoid so many props. whatever
  const [isEditing, setIsEditing] = useState(false);
  const [reviewText, setReviewText] = useState(review.reviewText);
  const [rating, setRating] = useState(review.rating);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await onUpdateReview(review.reviewId, { reviewText, rating });
    setSaving(false);
    setIsEditing(false);
  }

  return (
    <li className="profile__review--item">
      {game && (
        <img src={game.image} alt={game.title} className="profile__review--image" />
      )}
      <div className="profile__review--content">
        <h3 className="profile__review--title">{game ? game.title : review.gameSlug}</h3>

        {isEditing ? (
          <div className="profile__review--editform">
            <div className="profile__review--ratinginput">
              <label>Rating:</label>
              {[1, 2, 3, 4, 5].map((num) => (
                <label key={num}>
                  <input
                    type="radio"
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
              onChange={(e) => setReviewText(e.target.value)}
              rows={3}
              className="profile__review--textarea"
            />

            <div className="profile__review--editactions">
              <button onClick={handleSave} disabled={saving} className="profile__review--savebtn">
                {saving ? "Saving..." : "Save"}
              </button>
              <button onClick={() => setIsEditing(false)} className="profile__review--cancelbtn">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className={`profile__review--rating rating--${review.rating}`}>
              ⭐ {review.rating}
            </div>
            <p className="profile__review--text">{review.reviewText}</p>

            <div className="profile__review--actions">
              <button onClick={() => setIsEditing(true)} className="profile__review--savebtn">
                Update
              </button>
              <button onClick={() => onRemoveReview(review.reviewId)} className="profile__review--cancelbtn">
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </li>
  );
});

export default observer(Profile);
