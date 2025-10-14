import { observer } from "mobx-react-lite";
import GameGrid from "../views/GameGridView";
import mockimage from "../assets/mockimage.jpg";


function GameGridPresenter(props) {
  const games = props.model.games.trendingGames.length
    ? props.model.games.trendingGames
    : [
        { id: 1, title: "Mock Game", image: mockimage },
        { id: 2, title: "Mock Game", image: mockimage },
        { id: 3, title: "Mock Game", image: mockimage },
        { id: 4, title: "Mock Game", image: mockimage },
        { id: 5, title: "Mock Game", image: mockimage },
        { id: 6, title: "Mock Game", image: mockimage },
        { id: 7, title: "Mock Game", image: mockimage },
        { id: 8, title: "Mock Game", image: mockimage },
        { id: 9, title: "Mock Game", image: mockimage },
      ];

  return <GameGrid games={games} />;
}

const ObservedGameGridPresenter = observer(GameGridPresenter);

export default ObservedGameGridPresenter;