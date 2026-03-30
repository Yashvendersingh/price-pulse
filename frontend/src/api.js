// src/api.js
import axios from "axios";

const BASE_URL = "http://127.0.0.1:5000";

export const getDashboard = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/dashboard`);
    return res.data.data; 
  } catch (err) {
    console.error("Dashboard API error:", err);
    return [];
  }
};

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

export const getHistory = async (productId) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/history/${productId}`
    );
    return res.data.data;
  } catch (err) {
    console.error("History API error:", err);
    return [];
  }
};


export const simulatePrice = async (data) => {
  try {
    const res = await axios.post(`${BASE_URL}/simulate`, data);
    return res.data.data;
  } catch (err) {
    console.error("Simulation API error:", err);
    return null;
  }
};