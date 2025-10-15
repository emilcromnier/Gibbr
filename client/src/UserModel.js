// src/models/UserModel.js
import axios from "axios";
import { toJS } from "mobx";
import { searchGames } from "./GameSource";
import GamesModel from "./GamesModel";

const BACKEND_URL = "http://localhost:9000/api/auth";
const API_URL = "http://localhost:9000/api/users";
const REVIEW_URL = "http://localhost:9000/api/reviews";

const UserModel = {
  token: null,
  currentUser: null,
  loading: false,
  error: null,
  wishlist: [],
  reviews: [],
  friends: [],
  currentlyPlaying: [],
  
  
    // Submit a new review
  async submitReview({ gameSlug, reviewText, rating, completed = false, liked = false }) {
    if (!this.token) throw new Error("Not authenticated");
    console.log(gameSlug, reviewText, rating )

    this.loading = true;
    this.error = null;

    try {
      const response = await axios.post(
        REVIEW_URL,
        { gameSlug, reviewText, rating, completed, liked },
        { headers: { Authorization: `Bearer ${this.token}` } }
      );

      // Optionally update local reviews state
      this.reviews.push(response.data);
      console.log("Review submitted:", response.data);

      return response.data;
    } catch (err) {
      console.error("Failed to submit review:", err);
      this.error = err.response?.data?.error || err.message;
      throw err;
    } finally {
      this.loading = false;
    }
  },

  // Fetch all reviews for the current user
  async fetchReviews(gamesModel, user = this.currentUser) {
  if (!this.token || !this.currentUser) return;

  this.loading = true;
  this.error = null;

  try {
    const username = user.username;
    const response = await axios.get(
      `${API_URL}/${username}/reviews`,
      {
        headers: { Authorization: `Bearer ${this.token}` },
      }
    );

    const reviews = response.data;

    // Enrich each review with the game's details
    const enrichedReviews = [];
    for (const review of reviews) {
      const slug = review.gameSlug;

      try {
        // Reuse your existing fetchGameBySlug with caching
        const game = await this.fetchGameBySlug(slug, gamesModel);

        enrichedReviews.push({
          ...review,
          gameDetails: game, // attach game details here
        });
      } catch (err) {
        console.warn(`Failed to load game details for slug ${slug}:`, err);
        enrichedReviews.push(review); // fallback to raw review
      }
    }

    this.reviews = enrichedReviews;
    console.log("Fetched and enriched my reviews:", this.reviews);

    return this.reviews;
  } catch (err) {
    console.error("Failed to fetch reviews:", err);
    this.error = err.response?.data?.error || err.message;
    throw err;
  } finally {
    this.loading = false;
  }
},

  // Register a new user
  async register(username, email, password) {
    this.loading = true;
    this.error = null;

    try {
      const response = await axios.post(`${BACKEND_URL}/register`, {
        username,
        email,
        password,
      });
      console.log(" Registered:", response.data);
      return response.data;
    } catch (err) {
      console.error(" Registration error:", err);
      this.error = err.response?.data?.error || err.message;
      throw err;
    } finally {
      this.loading = false;
    }
  },

  // Log in an existing user
  async login(usernameOrEmail, password) {
    this.loading = true;
    this.error = null;

    try {
      const response = await axios.post(`${BACKEND_URL}/login`, {
        usernameOrEmail,
        password,
      });

      this.token = response.data.token;
        
      const profileRes = await axios.get("http://localhost:9000/api/auth/me", {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

      // Optionally: store token in localStorage to persist sessions
      localStorage.setItem("authToken", this.token);

        this.currentUser = profileRes.data;

      return response.data;
    } catch (err) {
     
      this.error = err.response?.data?.error || err.message;
      throw err;
    } finally {
      this.loading = false;
    }
  },

  // Logout: clear token & user data
  logout() {
    this.token = null;
    this.currentUser = null;
    localStorage.removeItem("authToken");

  },

async restoreSession() {
  const savedToken = localStorage.getItem("authToken");
  if (!savedToken) return;

  this.token = savedToken;


  try {
    const response = await axios.get("http://localhost:9000/api/auth/me", {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    this.currentUser = response.data;

    // populate friends observable
    this.friends = await this.fetchFriends(this.currentUser.username);


  } catch (err) {
    this.logout(); // token may have expired
  }
},

async addToWishlist(game, username, token) {
    try {
      const response = await axios.post(
        `${API_URL}/${username}/backlog`,
        { gameSlug: game.slug },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      this.wishlist.push(game); // update MobX state (optional)
    } catch (err) {
      this.error = err.response?.data?.error || err.message;
      throw err;
    }
  },

 async fetchGameBySlug(slug, gamesModel, { fullResults = false } = {}) {
  try {
    this.loading = true;
    this.error = null;

    if (gamesModel && !fullResults) {
      const cachedGame = gamesModel.fetchedGames.find(game => game.slug === slug);
      if (cachedGame) {
        console.log(`Using cached game for slug: ${slug}`);
        this.selectedGame = cachedGame;
        return cachedGame;
      }
    }

    // Fetch from API using your searchGames util
    console.log("Fetching by slug through API");
    const searchData = await searchGames(slug);

    if (!searchData?.results?.length) {
      throw new Error(`No game found for slug: ${slug}`);
    }

    // If fullResults requested, just return the raw array
    if (fullResults) {
      return searchData.results.map(gameData => ({
        id: gameData.id,
        slug: gameData.slug,
        title: gameData.name,
        description: gameData.description_raw || gameData.description || "No description available",
        image: gameData.background_image || "https://via.placeholder.com/150",
        released: gameData.released,
        rating: gameData.rating,
        platforms: gameData.platforms?.map(p => p.platform.name) || [],
        genres: gameData.genres?.map(g => g.name) || [],
      }));
    }

    // Otherwise, return the single match (exact slug or first)
    const gameData = searchData.results.find(g => g.slug === slug) || searchData.results[0];

    const singleGame = {
      id: gameData.id,
      slug: gameData.slug,
      title: gameData.name,
      description: gameData.description_raw || gameData.description || "No description available",
      image: gameData.background_image || "https://via.placeholder.com/150",
      released: gameData.released,
      rating: gameData.rating,
      platforms: gameData.platforms?.map(p => p.platform.name) || [],
      genres: gameData.genres?.map(g => g.name) || [],
    };

    this.selectedGame = singleGame;
    gamesModel.fetchedGames.push(singleGame);
    return singleGame;

  } catch (err) {
    this.error = err.message;
    throw err;
  } finally {
    this.loading = false;
  }
},

async search(query, gamesModel) {
  if (!query || query.trim() === "") return null;

  const q = query.trim();
  let foundUser = null;
  let foundGames = [];

  // Try to find user by username
  try {
    const userRes = await axios.get(`${API_URL}/${q}`);
    console.log("Found user:", userRes.data);
    foundUser = userRes.data;
  } catch (err) {
    if (err.response?.status !== 404) {
    }
  }

  // Try to find games by slug (even if user search failed or succeeded)
  try {
    const games = await this.fetchGameBySlug(q, gamesModel, { fullResults: true });
    console.log("Found games:", games);
    foundGames = games;
  } catch (err) {
   
  }

  // return both results in one object
  if (!foundUser && (!foundGames || foundGames.length === 0)) {
    return null; // nothing found
  }

  return {
    user: foundUser,    // can be null if not found
    games: foundGames,  // can be empty []
  };
},


async fetchWishlistDetails(gamesModel, user = this.currentUser) {
  if (!user?.backlog?.length) return;
  this.loading = true;

  const fetchedGames = [];

  for (const entry of user.backlog) {
    const slug = entry.gameSlug;

    if (this.wishlist.some(g => g.slug === slug)) {
      continue;
    }

    try {
      const game = await this.fetchGameBySlug(slug, gamesModel);
      fetchedGames.push(game);
    } catch (err) {

    }
  }

  // Bulk update once
  this.wishlist.push(...fetchedGames);
  this.loading = false;
},

// ==================== FRIENDS ====================

async fetchFriends(username) {
  if (!username) throw new Error("Username required");

  this.loading = true;
  this.error = null;

  try {
    const response = await axios.get(`${API_URL}/${username}/friends`);
    return response.data; // Array of { _id, username }
  } catch (err) {
    console.error("Failed to fetch friends:", err);
    this.error = err.response?.data?.error || err.message;
    throw err;
  } finally {
    this.loading = false;
  }
},

async addFriend(username, friendId) {
  if (!this.token) throw new Error("Not authenticated");

  this.loading = true;
  this.error = null;

  try {
    const response = await axios.post(
      `${API_URL}/${username}/friends`,
      { friendId },
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }
    );

    console.log("Friend added:", response.data);
    return response.data;
  } catch (err) {
    console.error("Failed to add friend:", err);
    this.error = err.response?.data?.error || err.message;
    throw err;
  } finally {
    this.loading = false;
  }
},

async removeFriend(username, friendId) {
  if (!this.token) throw new Error("Not authenticated");

  this.loading = true;
  this.error = null;

  try {
    const response = await axios.delete(
      `${API_URL}/${username}/friends/${friendId}`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }
    );

    console.log("Friend removed:", response.data);
    return response.data;
  } catch (err) {
    console.error("Failed to remove friend:", err);
    this.error = err.response?.data?.error || err.message;
    throw err;
  } finally {
    this.loading = false;
  }
},


};

makeAutoObservable(UserModel);
import { makeAutoObservable } from "mobx";
export default UserModel;
