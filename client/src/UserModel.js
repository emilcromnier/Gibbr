// src/models/UserModel.js
import axios from "axios";

const BACKEND_URL = "http://localhost:9000/api/auth";

const UserModel = {
  token: null,
  currentUser: null,
  loading: false,
  error: null,

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

      // Optionally: store token in localStorage to persist sessions
      localStorage.setItem("authToken", this.token);

      // Optionally: fetch user profile after login
      this.currentUser = {
        username: usernameOrEmail,
      };

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
};

export default UserModel;
