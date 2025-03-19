import axios from "axios";

const API_URL = "http://your-backend-url.com/api";

export const getUser = async (token) => {
  try {
    const res = await axios.get(`${API_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch user";
  }
};
