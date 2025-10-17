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
  otherWishlist: [],
  otherUser: null,
  reviews: [],
  friends: [],
  currentlyPlaying: [],


  


  //---------------------------------REVIEWS---------------------------------
    // Submit a new review
  async submitReview({ gameSlug, reviewText, rating, completed = false, liked = false }) {
    if (!this.token) throw new Error("Not authenticated");


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


      return response.data;
    } catch (err) {

      this.error = err.response?.data?.error || err.message;
      throw err;
    } finally {
      this.loading = false;
    }
  },


  // Update existing review
async updateReview(reviewId, updatedData) {
  if (!this.token) throw new Error("Not authenticated");

  this.loading = true;
  this.error = null;

  try {
    const response = await axios.put(
      `${REVIEW_URL}/${reviewId}`,
      updatedData,
      {
        headers: { Authorization: `Bearer ${this.token}` },
      }
    );

    const idx = this.reviews.findIndex(r => r.reviewId === reviewId);
    if (idx !== -1) {
      this.reviews[idx] = { ...this.reviews[idx], ...response.data };
    }


    return response.data;
  } catch (err) {

    this.error = err.response?.data?.error || err.message;
    throw err;
  } finally {
    this.loading = false;
  }
},

// Delete a review
async deleteReview(reviewId) {
  if (!this.token) throw new Error("Not authenticated");

  this.loading = true;
  this.error = null;

  try {
    await axios.delete(`${REVIEW_URL}/${reviewId}`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });

    this.reviews = this.reviews.filter(r => r.reviewId !== reviewId);
  } catch (err) {

    this.error = err.response?.data?.error || err.message;
    throw err;
  } finally {
    this.loading = false;
  }
},

  // Fetch all reviews for the current user
  async fetchMyReviews(gamesModel) {
  if (!this.token || !this.currentUser) return;

  this.loading = true;
  this.error = null;

  try {
    const username = this.currentUser.username;
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

        enrichedReviews.push(review); // fallback to raw review
      }
    }

    this.reviews = enrichedReviews;


    return this.reviews;
  } catch (err) {

    this.error = err.response?.data?.error || err.message;
    throw err;
  } finally {
    this.loading = false;
  }
},

getReviewForGame(slug) {
  return this.reviews.find(r => r.gameSlug === slug) || null;
},

// --------------------USERS & AUTH --------------------
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

      return response.data;
    } catch (err) {

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

async addToWishlist(game) {
  if (!this.currentUser) throw new Error("Not authenticated");

  const username = this.currentUser.username;

  try {
    await axios.post(
      `${API_URL}/${username}/backlog`,
      { gameSlug: game.slug },
      { headers: { Authorization: `Bearer ${this.token}` } }
    );

    this.wishlist.push(game); // update MobX state
  } catch (err) {
    this.error = err.response?.data?.error || err.message;
    throw err;
  }
},


async removeFromWishlist(gameOrSlug) {
  if (!this.currentUser) throw new Error("Not authenticated");

  const username = this.currentUser.username;
  // Accept either a game object or slug string
  const gameSlug = typeof gameOrSlug === "string" ? gameOrSlug : gameOrSlug.slug;

  try {
    await axios.delete(`${API_URL}/${username}/backlog/${gameSlug}`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });

    // Remove from local MobX state
    this.wishlist = this.wishlist.filter(g => g.slug !== gameSlug);
  } catch (err) {
    this.error = err.response?.data?.error || err.message;

    throw err;
  }
},


 async fetchGameBySlug(slug, gamesModel, { fullResults = false } = {}) {
  try {
    this.loading = true;
    this.error = null;

    // First check cache
    if (gamesModel && !fullResults) {
      const cachedGame = gamesModel.fetchedGames.find(game => game.slug === slug);
      if (cachedGame) {
  
        this.selectedGame = cachedGame;
        return cachedGame;
      }
    }

    // Fetch from API using your searchGames util

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
    return singleGame;

  } catch (err) {
    this.error = err.message;
    throw err;
  } finally {
    this.loading = false;
  }
},

async fetchUserByUsername(username) {
  try {
    const response = await axios.get(`${API_URL}/${username}`);
   
    this.otherUser = response.data;
    return response.data;
  } catch (err) {
    if (err.response?.status === 404) {
      // User not found, return null
      return null;
    } else {
      // Other errors should be thrown
      
      throw err;
    }
  }
},



async search(query, gamesModel) {
  if (!query || query.trim() === "") return null;

  const q = query.trim();


  //We use let here because foundUser and foundGames are initially declared and later conditionally 
  //assigned based on asynchronous fetch results. This way is clearer than creating extra functions just 
  // to keep using const. In other parts of the code we use const consistently for single-assignment variables.
  let foundUser = null;
  let games = [];


  try {
    foundUser = await this.fetchUserByUsername(q);
  } catch (err) {
    if (err.response?.status !== 404) {

      throw err;
    }
  }

  try {
    games = await this.fetchGameBySlug(q, gamesModel, { fullResults: true });
  } catch (err) {

  }

  if (foundUser || (games && games.length > 0)) {
    return {
      user: foundUser,
      games: games || [],
    };
  }

  return null;
},

async fetchWishlistDetails(gamesModel, user = this.currentUser) {
    this.otherWishlist.splice(0, this.otherWishlist.length);
  if (!user?.backlog?.length) return;
  this.loading = true;

  const fetchedGames = [];

  // Decide which wishlist to use
  const targetList = user === this.currentUser ? this.wishlist : this.otherWishlist;

  for (const entry of user.backlog) {
    const slug = entry.gameSlug;

    // Skip if already in target list
    if (targetList.some(g => g.slug === slug)) {
      continue;
    }

    try {
      const game = await this.fetchGameBySlug(slug, gamesModel);
      fetchedGames.push(game);
    } catch (err) {
  
    }
  }

  // Bulk update once
  targetList.push(...fetchedGames);
  this.loading = false;
},

isInWishlist(slug) {
  return this.wishlist.some(game => game.slug === slug);
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

    this.error = err.response?.data?.error || err.message;
    throw err;
  } finally {
    this.loading = false;
  }
},

    // Add a friend
  async addFriend(friendId) {
    if (!this.currentUser) {

      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/${this.currentUser.username}/friends`,
        { friendId },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );



      // Update local friends list reactively
      this.currentUser.friends.push(friendId);
    } catch (err) {

      this.error = err.response?.data?.error || err.message;
    }
  },

  // Remove a friend
  async removeFriend(friendId) {
    if (!this.currentUser) {

      return;
    }

    try {
      const res = await axios.delete(
        `${API_URL}/${this.currentUser.username}/friends/${friendId}`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );


      // Update local friends list reactively
      this.currentUser.friends = this.currentUser.friends.filter(
        (f) => f !== friendId
      );
    } catch (err) {
  
      this.error = err.response?.data?.error || err.message;
    }
  },


};


export default UserModel;
