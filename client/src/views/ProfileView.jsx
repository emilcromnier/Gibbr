import '/src/App.css'
import { observer } from 'mobx-react-lite';




function Profile(props) {
    const wishlist = props.wishlist;
    const reviews = props.reviews;
    
    
    function InspectGameACB(gameId){
    window.location.hash = `#/game/${gameId}`;
  }
  
  

  return (
    <div className='ProfileContainer'>
        <div className='ProfileHead'>
            <h1>{props.username}</h1>
            <p>{props.description}</p>
        </div>
        <div className='RecentReviews'>
            <h1>Recent Reviews</h1>
            <ul>
            {reviews.map((game) => (
          <li key={game.id}>
            {game.name}
          </li>
            ))}
            </ul>
        </div>
        <div className='Wishlist'>
                <div>
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

export default Profile;