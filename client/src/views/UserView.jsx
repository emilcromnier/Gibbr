import '/src/App.css';
import '/src/styles/profile.css';
import { observer } from 'mobx-react-lite';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

function User(props) {
  const { wishlist = [], reviews = [], username, showAddFriend, onAddFriend } = props;
  const [friendAdded, setFriendAdded] = useState(false);

  function InspectGameACB(gameId) {
    window.location.hash = `#/game/${gameId}`;
  }

  async function handleAddFriend() {
    if (onAddFriend) {
      await onAddFriend();
      setFriendAdded(true);
      setTimeout(() => setFriendAdded(false), 2500);
    }
  }

  return (
    <div className="profile">
      {/* HEADER */}
      <div className="profile__header">
        <h1>{username}</h1>

        {showAddFriend && (
          <div className="profile__addfriend--wrapper">
            <button onClick={handleAddFriend} className="profile__addfriend">
              Add Friend
            </button>

            <AnimatePresence>
              {friendAdded && (
                <motion.div
                  className="profile__addfriend--success"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  ✅ Friend added successfully!
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* MAIN CONTENT */}
      <div className="profile__main--content">
        <div className="profile__reviews">
          <h1 className="profile__section--title">Recent Reviews</h1>
          <ul className="profile__reviews--list">
            {reviews
              ?.filter((r) => r)
              .map((review, index) => {
                const game = review?.gameDetails;
                const key = review?.reviewId || review?._id || index;
                return (
                  <li key={key} className="profile__review--item">
                    {game?.image && (
                      <img
                        src={game.image}
                        alt={game.title || 'Game image'}
                        className="profile__review--image"
                      />
                    )}
                    <div className="profile__review--content">
                      <h3 className="profile__review--title">
                        {game?.title || review?.gameSlug || 'Unknown Game'}
                      </h3>
                      <div
                        className={`profile__review--rating rating--${review?.rating || 0}`}
                      >
                        {review?.rating ?? '-'}
                      </div>
                      <p className="profile__review--text">
                        {review?.reviewText || 'No review text available.'}
                      </p>
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>

      {/* WISHLIST */}
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default observer(User);