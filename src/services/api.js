import axios from "axios";
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const generateELDLogs = async (tripData) => {
  try {
    const response = await api.post("/generate-eld-logs/", tripData);
    return response.data;
  } catch (error) {
    console.error("Error generating ELD logs:", error);
    throw error;
  }
};

export const generateRoute = async (tripData) => {
  try {
    const response = await api.post("/generate-route/", tripData);
    return response.data;
  } catch (error) {
    console.error("Error generating route:", error);
    throw error;
  }
};
