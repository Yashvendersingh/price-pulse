// src/api.js
import axios from "axios";

const BASE_URL = "http://127.0.0.1:5000";

// 🔥 DASHBOARD DATA
export const getDashboard = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/dashboard`);
    return res.data.data; // ⭐ important
  } catch (err) {
    console.error("Dashboard API error:", err);
    return [];
  }
};

// 🔥 PRODUCT RECOMMENDATION
export const getRecommendation = async (productId) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/recommendation/${productId}`
    );
    return res.data.data;
  } catch (err) {
    console.error("Recommendation API error:", err);
    return null;
  }
};

// 🔥 PRICE COMPARISON
export const getComparison = async (productId) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/comparison/${productId}`
    );
    return res.data.data;
  } catch (err) {
    console.error("Comparison API error:", err);
    return null;
  }
};