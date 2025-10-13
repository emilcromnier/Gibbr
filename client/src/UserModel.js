// src/models/UserModel.js
import axios from "axios";
import { toJS } from "mobx";
import { searchGames } from "./GameSource";

const BACKEND_URL = "http://localhost:9000/api/auth";
const API_URL = "http://localhost:9000/api/users";

const UserModel = {
  token: null,
  currentUser: null,
  loading: false,
  error: null,
  wishlist: [],

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
      console.log("Login successful:", this.token);
        
      const profileRes = await axios.get("http://localhost:9000/api/auth/me", {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

      // Optionally: store token in localStorage to persist sessions
      localStorage.setItem("authToken", this.token);

        this.currentUser = profileRes.data;
        console.log("Fetched user profile:", this.currentUser);

      return response.data;
    } catch (err) {
      console.error("Login error:", err);
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
    console.log("Logged out");
  },

async restoreSession() {
  const savedToken = localStorage.getItem("authToken");
  if (!savedToken) return;

  this.token = savedToken;
  console.log("Session restored, fetching profile...");

  try {
    const response = await axios.get("http://localhost:9000/api/auth/me", {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    this.currentUser = response.data;
    console.log("Profile restored:", this.currentUser);
  } catch (err) {
    console.error("Failed to restore user session:", err);
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

      console.log("Game added to wishlist:", response.data);
      this.wishlist.push(game); // update MobX state (optional)
    } catch (err) {
      console.error("Failed to add game to wishlist:", err);
      this.error = err.response?.data?.error || err.message;
      throw err;
    }
  },

 async fetchGameBySlug(slug) {
  try {
    this.loading = true;
    this.error = null;

    // Use searchGames instead of direct slug route
    const searchData = await searchGames(slug);

    if (!searchData || !searchData.results || searchData.results.length === 0) {
      throw new Error(`No game found for slug: ${slug}`);
    }

    // Try to find exact match by slug in search results
    const gameData = searchData.results.find(g => g.slug === slug) || searchData.results[0];

    this.selectedGame = {
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

    return this.selectedGame;
  } catch (err) {
    console.error("Error fetching game by slug via search:", err);
    this.error = err.message;
    throw err;
  } finally {
    this.loading = false;
  }
},

async fetchWishlistDetails() {
  if (!this.currentUser?.backlog?.length) return;

  const fetchedGames = [];

  for (const entry of this.currentUser.backlog) {
    const slug = entry.gameSlug;

    if (this.wishlist.some(g => g.slug === slug)) {
      console.log(`Skipping slug already in cache: ${slug}`);
      continue;
    }

    try {
      const game = await this.fetchGameBySlug(slug);
      fetchedGames.push(game);
    } catch (err) {
      console.error(`Failed to fetch details for ${slug}:`, err);
    }
  }

  // Bulk update once
  this.wishlist.push(...fetchedGames);
  console.log("LOCAL WISHLIST: ", this.wishlist);
}


};

export default UserModel;
