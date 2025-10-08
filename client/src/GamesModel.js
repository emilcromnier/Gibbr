import { searchGames, getTrendingGames } from "./GameSource";

const GamesModel= {
  loading: false,
  error: null,

  trendingGames: [],

  async fetchTrendingGames() {
    const data = await getTrendingGames();
    console.log("Data", data);
    this.trendingGames = data.results.map(game => ({
    id: game.id || game.slug, // use slug as fallback if id is missing
    title: game.name,
    image: game.background_image || "https://via.placeholder.com/150",
  }));

  console.log("Games loaded:", this.trendingGames);
  }

  };






export default GamesModel;
