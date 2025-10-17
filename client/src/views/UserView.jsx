import '/src/App.css';
import '/src/styles/profile.css';
import { observer } from 'mobx-react-lite';




function User(props) {
    const wishlist = props.wishlist;
 

    
    
    function InspectGameACB(gameId){
    window.location.hash = `#/game/${gameId}`;
    }
  
  
    
  return (
    <div className='profile'>
        <div className='profile__header'>
            <h1>{props.username}</h1>
                    {/*Add Friend Button */}
        {props.showAddFriend && (
          <button onClick={props.onAddFriend} className='profile__addfriend'>
            Add Friend
          </button>
        )}
        </div>
        
        <div className='profile__wishlist'>
          <h1 className='profile__wishlist--title'>Wishlist</h1>
          <div className='profile__wishlist--carousel'>
            {wishlist.map((game) => (
              <div key={game.id} className='profile__wishlist--item' onClick={() => InspectGameACB(game.id)}>
              <p>{game.title}</p>
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