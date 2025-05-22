//frontend/src/services/authService.js

import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

// Register User
export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

// Login User
export const loginUser = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
};

// Get Current User (Token-based Auth)
export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

// Logout User
export const logoutUser = () => {
  localStorage.removeItem("user");
};
