import { searchGames, getTrendingGames, getGameById, getGameBySlug } from "./GameSource";

const GamesModel= {
  loading: false,
  error: null,

  trendingGames: [],

  async fetchTrendingGames() {
    const data = await getTrendingGames();
    this.trendingGames = data.results.map(game => ({
    id: game.id || game.slug, // use slug as fallback if id is missing
    title: game.name,
    image: game.background_image || "https://via.placeholder.com/150",
  }));

  },

  async fetchGameById(id) {
    try {
      this.loading = true;
      this.error = null;

      const data = await getGameById(id); // call your backend
      this.selectedGame = {
        id: data.id || data.slug,
        slug: data.slug,
        title: data.name,
        description: data.description_raw || data.description,
        image: data.background_image || "https://via.placeholder.com/150",
        released: data.released,
        rating: data.rating,
        platforms: data.platforms?.map(p => p.platform.name) || [],
        genres: data.genres?.map(g => g.name) || [],
      };
     
    } catch (err) {
      console.error("Error fetching game by ID:", err);
      this.error = err.message;
    } finally {
      this.loading = false;
    }
  },



  };






export default GamesModel;
