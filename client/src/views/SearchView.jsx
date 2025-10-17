import '/src/App.css';
import '/src/styles/search.css';
import { observer } from 'mobx-react-lite';

function Search(props) {
  function InspectGameACB(gameId) {
    window.location.hash = `#/game/${gameId}`;
  }

  function InspectUserACB(username) {
    window.location.hash = `#/user/${username}`;
  }

  if (!props.result) {
    return <div className="search__empty">No results found.</div>;
  }

  return (
    <div className="search">
      {props.result.user && (
        <div className="search__user">
          <h1 className="search__user--title">User found:</h1>
          <div
            className="search__user--container"
            onClick={() => InspectUserACB(props.result.user.username)}
          >
            <h3 className="search__user--name">
              Username: {props.result.user.username}
            </h3>
            <p className="search__user--stats">
              Games reviewed: {props.result.user.stats.gamesReviewed}
            </p>
          </div>
        </div>
      )}

      {props.result.games && props.result.games.length > 0 && (
        <div className="search__games">
          <h2 className="search__games--title">Games found:</h2>
          <div className="search__games--grid">
            {props.result.games.map((game) => (
              <div
                key={game.id}
                className="search__games--card"
                onClick={() => InspectGameACB(game.id)}
              >
                {game.image && (
                  <img
                    src={game.image}
                    alt={game.title}
                    className="search__games--image"
                  />
                )}
                <div className="search__games--info">
                  <h3 className="search__games--name">{game.title}</h3>
                  <p className="search__games--released">
                    {game.released || 'Release date unknown'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!props.result.user &&
        (!props.result.games || props.result.games.length === 0) && (
          <div className="search__empty">No results found.</div>
        )}
    </div>
  );
}

export default observer(Search);