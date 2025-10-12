import '/src/App.css'
import { observer } from 'mobx-react-lite';




function Game(props) {
    const game = props.game;
    
  function handleAddToWishlist() {

    props.onAddToWishlist(game);
  }

    

  return(
    <div className="game-details">
      <h1>{game.title}</h1>
      <img src={game.image} alt={game.title} style={{ width: "300px", borderRadius: "8px" }} />
      <p><strong>Released:</strong> {game.released}</p>
      <p>{game.description}</p>
      <button onClick={handleAddToWishlist}>
        Add to Wishlist
      </button>

    </div>


  )
  
  
}

export default Game;