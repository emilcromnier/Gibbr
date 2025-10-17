import { observer } from "mobx-react-lite";
import GameGrid from "../views/GameGridView";
import mockimage from "../assets/mockimage.jpg";


function GameGridPresenter(props) {
  const { games: gameStore } = props.model;

  // Helper: mock fallback data
  const mockGames = [
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

  // Apply mock fallback if arrays are empty
  const trendingGames =
    gameStore.trendingGames.length > 0 ? gameStore.trendingGames : mockGames;

  const recentlyReleasedGames =
    gameStore.recentGames.length > 0 ? gameStore.recentGames : mockGames;

  const topRatedGames =
    gameStore.topRatedGames.length > 0 ? gameStore.topRatedGames : mockGames;

  return <GameGrid recentlyReleasedGames={recentlyReleasedGames} topRatedGames={topRatedGames} trendingGames = {trendingGames}/>;
}

const ObservedGameGridPresenter = observer(GameGridPresenter);

export default ObservedGameGridPresenter;