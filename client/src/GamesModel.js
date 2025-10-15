import { searchGames, getTrendingGames, getGameById, getGameBySlug } from "./GameSource";

const GamesModel= {
  loading: false,
  error: null,

  trendingGames: [],
  fetchedGames: [],

  async fetchTrendingGames() {
      if (this.trendingGames.length > 0) {
        console.log("ALREADY FETCHED GAMES")
    // already cached, skip API call
    return;
  }
    console.log("FETCHING TRENDING FROM API")
    const data = await getTrendingGames();
    this.trendingGames = data.results.map(game => ({
    id: game.id || game.slug, // use slug as fallback if id is missing
    slug: game.slug,
    title: game.name,
    image: game.background_image || "https://via.placeholder.com/150",
  }));
    this.fetchedGames.push(...this.trendingGames);

  },

  async fetchGameById(id) {

  try {
    this.loading = true;
    this.error = null;

    //Try to find the game locally first
    const localGame = this.fetchedGames.find(
      game => Number(game.id) === Number(id)
    );

    if (localGame) {
      console.log("Using cached game:", localGame);
      this.selectedGame = localGame;
      return; // Skip API call
    }

    //  If not found locally, fetch from API
    console.log("Fetching from API");
    const data = await getGameById(id);

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

    // Optionally cache it for future lookups
    this.fetchedGames.push(this.selectedGame);

  } catch (err) {
    console.error("Error fetching game by ID:", err);
    this.error = err.message;
  } finally {
    this.loading = false;
  }
},


  };






export default GamesModel;
