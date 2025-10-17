// src/views/ProfileView.js
import "/src/App.css";
import '/src/styles/profile.css'
import { observer } from "mobx-react-lite";

function Profile(props) {
  const wishlist = props.wishlist;
  const reviews = props.reviews;

  function InspectGameACB(gameId) {
    window.location.hash = `#/game/${gameId}`;
  }

  return (
    <div className="profile">
      <div className="profile__header">
        <h1>{props.username}</h1>
      </div>

<div className="profile__main--content">
  <div className="profile__reviews">
    <h1 className="profile__section--title">Recent Reviews</h1>
    <ul className="profile__reviews--list">
      {reviews.map((review) => {
        const game = review.gameDetails;
        return (
          <li key={review.reviewId || review._id} className="profile__review--item">
            {game && (
              <img
                src={game.image}
                alt={game.title}
                className="profile__review--image"
              />
            )}
            <div className="profile__review--content">
              <h3 className="profile__review--title">
                {game ? game.title : review.gameSlug}
              </h3>
              <div
                className={`profile__review--rating rating--${review.rating}`}
              >
                {review.rating}
              </div>
              <p className="profile__review--text">{review.reviewText}</p>

              {/* Action Buttons */}
              <div
                className="profile__review--actions"
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "8px",
                }}
              >
                <button
                  onClick={() => props.onUpdateReview(review.reviewId, review)}
                  className="profile__review--button update"
                >
                  Update Review
                </button>

                <button
                  onClick={() => props.onRemoveReview(review.reviewId)}
                  className="profile__review--button delete"
                  style={{
                    backgroundColor: "red",
                    color: "white",
                  }}
                >
                  Delete Review
                </button>
              </div>
            </div>
          </li>
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
              <img
                src={game.image}
                alt={game.title}
                className="profile__wishlist--image"
              />
              <p className="profile__wishlist--gametitle">{game.title}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevent triggering InspectGameACB
                  props.onRemoveFromWishlist(game);
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

export default observer(Profile);
