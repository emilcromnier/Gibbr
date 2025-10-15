import '/src/App.css'
import '/src/styles/navbar.css'
import { observer } from 'mobx-react-lite';
import logo from '../assets/GibbR_new_logo.png.png';
import { useState } from "react";



function Search(props) {
        function InspectGameACB(gameId){
    window.location.hash = `#/game/${gameId}`;
  }

    if (!props.result) {
    return <div>No results found.</div>;
  }

  return (
    <div>
      {props.result.user && (
        <div>
          <h1>User found:</h1>
          <h3>Username: {props.result.user.username}</h3>
          <p>Games reviewed: {props.result.user.stats.gamesReviewed}</p>
        </div>
      )}

      {props.result.games && props.result.games.length > 0 && (
        <div>
          <h2>Games found:</h2>
         
            {props.result.games.map(game => (
            <div className='search-game-container' onClick={() => InspectGameACB(game.id)}> 
              <h2>{game.title}</h2>
              <p>{game.released}</p>
            </div>
            ))}
         
        </div>
      )}

      {!props.result.user && (!props.result.games || props.result.games.length === 0) && (
        <div>No results found.</div>
      )}
    </div>
  );
  
  
}

export default Search;