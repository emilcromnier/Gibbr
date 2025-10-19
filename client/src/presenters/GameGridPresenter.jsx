import { observer } from "mobx-react-lite";
import GameGrid from "../views/GameGridView";


function GameGridPresenter(props) {
  const { games: gameStore } = props.model;

  const trendingGames = gameStore.trendingGames;

  const recentlyReleasedGames = gameStore.recentGames;

  const topRatedGames = gameStore.topRatedGames;

  return <GameGrid recentlyReleasedGames={recentlyReleasedGames} topRatedGames={topRatedGames} trendingGames = {trendingGames}/>;
}

const ObservedGameGridPresenter = observer(GameGridPresenter);

export default ObservedGameGridPresenter;