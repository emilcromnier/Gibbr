import '/src/App.css';
import '/src/styles/profile.css';
import { observer } from 'mobx-react-lite';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

function User(props) {
  const wishlist = props.wishlist;
  const [friendAdded, setFriendAdded] = useState(false);    
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
              <p className='profile__wishlist--gametitle'>{game.title}</p>
            </div>
          ))}
        </div>
        
      </div>

    </div>
    
    

  );
}

export default observer(User);