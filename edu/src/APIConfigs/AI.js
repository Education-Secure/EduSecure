// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // ✅ change to your ngrok URL in production
});

/**
 * 1. Generate Roadmap
 */
export const generateRoadmap = async (skill) => {
  const res = await API.post("/roadmap", { skill });
  return res.data;
};

/**
 * 2. Generate Content for a Node
 */
export const generateContent = async (topic) => {
  const res = await API.post("/content", { topic });
  return res.data;
};

/**
 * 3. Generate Quiz for a Node
 */
export const generateQuiz = async (topic) => {
  const res = await API.post("/quiz", { topic });
  return res.data;
};

/**
 * 4. Validate Quiz Answers
 */
export const validateQuiz = async (quiz, answers) => {
  const res = await API.post("/validate-quiz", { quiz, answers });
  return res.data;
};

/**
 * 5. Chatbot (Q&A)
 */
export const chatWithTutor = async (question) => {
  const res = await API.post("/chat", { question });
  return res.data;
};

/**
 * 6. Final Test
 */
export const generateFinalTest = async (skill) => {
  const res = await API.post("/final-test", { skill });
  return res.data;
};
