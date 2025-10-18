import { observer } from "mobx-react-lite";
import GameGrid from "../views/GameGridView";
import mockimage from "../assets/mockimage.jpg";
import mockimage2 from "../assets/mockimage2.jpg";


function GameGridPresenter(props) {
  const { games: gameStore } = props.model;

  // Helper: mock fallback data
  const mockGames = [
    { id: 1, title: "Mock Gameeeeeeeeeeeeeeeeee this is a long title", image: mockimage },
    { id: 2, title: "Mock Game", image: mockimage2 },
    { id: 3, title: "Mock Game", image: mockimage },
    { id: 4, title: "Mock Game", image: mockimage2 },
    { id: 5, title: "Mock Game", image: mockimage },
    { id: 6, title: "Mock Game", image: mockimage2 },
    { id: 7, title: "Mock Game", image: mockimage },
    { id: 8, title: "Mock Game", image: mockimage2 },
    { id: 9, title: "Mock Game", image: mockimage },
    { id: 10, title: "Mock Game", image: mockimage },
    { id: 11, title: "Mock Game", image: mockimage },
    { id: 12, title: "Mock Game", image: mockimage },
    { id: 13, title: "Mock Game", image: mockimage },
    { id: 14, title: "Mock Game", image: mockimage2 },
    { id: 15, title: "Mock Game", image: mockimage },
    { id: 16, title: "Mock Game", image: mockimage2 },
    { id: 17, title: "Mock Game", image: mockimage },
    { id: 18, title: "Mock Game", image: mockimage2 },
    { id: 19, title: "Mock Game", image: mockimage2 },
    { id: 20, title: "Mock Game", image: mockimage },
    { id: 21, title: "Mock Game", image: mockimage2 },
    { id: 22, title: "Mock Game", image: mockimage },
    { id: 23, title: "Mock Game", image: mockimage2 },
    { id: 24, title: "Mock Game", image: mockimage },
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