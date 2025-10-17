import '/src/App.css';
import '/src/styles/profile.css';
import { observer } from 'mobx-react-lite';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

function User(props) {
  const wishlist = props.wishlist;
  const [friendAdded, setFriendAdded] = useState(false);
  const reviews = props.reviews;
  function InspectGameACB(gameId){
  window.location.hash = `#/game/${gameId}`;
  }

  async function handleAddFriend() {
    if (props.onAddFriend) {
      await props.onAddFriend();
      setFriendAdded(true);
      setTimeout(() => setFriendAdded(false), 2500);
    }
  }  
    
  return (
    <div className='profile'>

      <div className="profile__header">
        <h1>{props.username}</h1>

        <div className="profile__addfriend--wrapper">
          {props.showAddFriend && (
            <button onClick={handleAddFriend} className="profile__addfriend">
              Add Friend
            </button>
          )}

          <AnimatePresence>
            {friendAdded && (
              <motion.div
                className="profile__addfriend--success"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                ✅ Friend added successfully!
              </motion.div>
            )}
          </AnimatePresence>
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
            </div>
          </li>
        );
      })}
    </ul>
  </div>
</div>
        
        <div className='profile__wishlist'>
          <h1 className='profile__wishlist--title'>Wishlist</h1>
          <div className='profile__wishlist--carousel'>
            {wishlist.map((game) => (
              <div key={game.id} className='profile__wishlist--item' onClick={() => InspectGameACB(game.id)}>
              <img
                src={game.image}
                alt={game.title}
                className='profile__wishlist--image'
              />
            </div>
          ))}
        </div>
        
      </div>

    </div>
    
    

  );
}

export default observer(User);