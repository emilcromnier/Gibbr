import { searchGames, getTopRatedGames, getRecentGames, getTrendingGames, getGameById, getGameBySlug } from "./GameSource";
import { makeAutoObservable } from "mobx";

const GamesModel= {
  loading: false,
  error: null,

  trendingGames: [],
  fetchedGames: [],
    topRatedGames: [],
  recentGames: [],
  selectedGame: null,

  async fetchTrendingGames() {
      if (this.trendingGames.length > 0) {
     
    // already cached, skip API call
    return;
  }
    
    const data = await getTrendingGames();
    this.trendingGames = data.results.map(game => ({
      id: game.id || game.slug,
      slug: game.slug,
      released: game.released,
      title: game.name,
      image: game.background_image,
  }));
    //this.fetchedGames.push(...this.trendingGames);

  },

  async fetchTopRatedGames() {
    if (this.topRatedGames.length > 0) {
     
      return;
    }
  
    const data = await getTopRatedGames();
    this.topRatedGames = data.results.map(game => ({
      id: game.id || game.slug,
      slug: game.slug,
      released: game.released,
      title: game.name,
      image: game.background_image,
    }));
    //this.fetchedGames.push(...this.topRatedGames);
  },

  async fetchRecentGames() {
    if (this.recentGames.length > 0) {
     
      return;
    }
   
    const data = await getRecentGames();
    this.recentGames = data.results.map(game => ({
      id: game.id || game.slug,
      slug: game.slug,
      released: game.released,
      title: game.name,
      image: game.background_image,
    }));
    //this.fetchedGames.push(...this.recentGames);
  },

  async fetchGameById(id) {

  try {
    this.loading = true;
    this.error = null;

    //Try to find the game locally first
    this.selectedGame = this.fetchedGames.find(
      game => Number(game.id) === Number(id)
    );

    if (this.selectedGame) {
        console.log("CACHED", this.selectedGame);
      
      return; // Skip API call
    }

    //  If not found locally, fetch from API
 
    const data = await getGameById(id);

    this.selectedGame = {
      id: data.id || data.slug,
      slug: data.slug,
      title: data.name,
      description: data.description_raw || data.description,
      image: data.background_image,
      released: data.released,
      rating: data.rating,
      platforms: data.platforms?.map(p => p.platform.name) || [],
      genres: data.genres?.map(g => g.name) || [],
    };

    // Optionally cache it for future lookups
    this.fetchedGames.push(this.selectedGame);

  } catch (err) {

    this.error = err.message;
  } finally {
    this.loading = false;
  }
},


  };






export default GamesModel;
