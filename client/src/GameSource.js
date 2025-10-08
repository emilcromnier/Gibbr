import axios from "axios";

const BACKEND_URL = "http://localhost:9000/api";


export async function searchGames(query) {
  try {
    const response = await axios.get(`${BACKEND_URL}/games/search`, {
      params: { query } // axios automatically encodes this
    });
    console.log(response);
    return response.data;
  } catch (err) {
    console.error("Error searching games:", err);
    throw err;
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
