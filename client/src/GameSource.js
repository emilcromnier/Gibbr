import axios from "axios";

const BACKEND_URL = "http://localhost:9000/api";




export async function getGameById(id) {
  try {
    const response = await axios.get(`${BACKEND_URL}/games/id/${id}`);
    return response.data;
  } catch (err) {
    console.error("Error fetching game by ID:", err);
    throw err;
  }
}

export async function getGameBySlug(slug) {
  const response = await axios.get(`${BACKEND_URL}/games/slug/${slug}`);
  return response.data;
}

export async function searchGames(query) {
  try {
    const response = await axios.get(`${BACKEND_URL}/games/search`, {
      params: { query } // Axios automatically encodes this as a query string
    });
    console.log(response); // full Axios response, mostly for debugging
    return response.data;  // the actual search results returned from your backend
  } catch (err) {
    console.error("Error searching games:", err);
    throw err; // propagate error to caller
  }
}


export async function getTrendingGames() {
  try {
    const response = await axios.get(`${BACKEND_URL}/games/trending`);
    return response.data; 
  } catch (err) {
    console.error("Error fetching trending games:", err);
    throw err;
  }
}
