import '/src/App.css'
import { observer } from 'mobx-react-lite';




function Profile(props) {
    const wishlist = props.wishlist;
    const reviews = props.reviews;
  
  

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
            <h1>Wishlist</h1>
            <ul>
            {wishlist.map((game) => (
          <li key={game.gameSlug}>
            {game.gameSlug}
          </li>
            ))}
            </ul>
        </div>

    </div>
    
    

  );
}

export default Profile;