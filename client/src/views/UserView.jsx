import '/src/App.css'
import { observer } from 'mobx-react-lite';




function User(props) {
    const wishlist = props.wishlist;
 

    
    
    function InspectGameACB(gameId){
    window.location.hash = `#/game/${gameId}`;
    }
  
  
    
  return (
    <div className='ProfileContainer'>
        <div className='ProfileHead'>
            <h1>{props.username}</h1>
                    {/*Add Friend Button */}
        {props.showAddFriend && (
          <button onClick={props.onAddFriend} className='add-friend-btn'>
            Add Friend
          </button>
        )}
        </div>
        
        <div className='Wishlist'>
                <div>
                    <h1>Wishlist</h1>
      {wishlist.map((game) => (
        <div className='gameContainer' onClick={() => InspectGameACB(game.id)}>
        <p>{game.title}</p>
        <img
          key={game.id}
          src={game.image}
          alt={game.title}
          style={{ width: '150px', height: '150px', objectFit: 'cover', margin: '8px' }}
        />
        </div>
      ))}
    </div>
        
        </div>

    </div>
    
    

  );
}

export default User;