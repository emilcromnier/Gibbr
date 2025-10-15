// src/views/ProfileView.js
import "/src/App.css";
import { observer } from "mobx-react-lite";

function Profile(props) {
  const wishlist = props.wishlist;
  const reviews = props.reviews;

  function InspectGameACB(gameId) {
    window.location.hash = `#/game/${gameId}`;
  }

  return (
    <div className="ProfileContainer">
      <div className="ProfileHead">
        <h1>{props.username}</h1>
      </div>

      <div className="RecentReviews">
        <h1>Recent Reviews</h1>
        <ul>
          {reviews.map((review) => {
            const game = review.gameDetails;
            return (
              <li key={review._id}>
                {game && <img src={game.image} alt={game.title} />}
                <div>
                  <h3>{game ? game.title : review.gameSlug}</h3>
                  <div>{review.rating}/5</div>
                  <p>{review.reviewText}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="Wishlist">
        <div>
          <h1>Wishlist</h1>
          {wishlist.map((game) => (
            <div
              key={game.id}
              className="gameContainer"
              onClick={() => InspectGameACB(game.id)}
            >
              <p>{game.title}</p>
              <img
                src={game.image}
                alt={game.title}
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  margin: "8px",
                }}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevent triggering InspectGameACB
                  props.onRemoveFromWishlist(game);
                }}
                className="removeButton"
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
