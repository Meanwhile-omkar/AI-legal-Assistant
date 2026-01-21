import axios from "axios";

// Fallback to localhost if env is missing
const API_URL = process.env.REACT_APP_BACKEND_URL;

export const generateDocument = (caseData, selectedDoc) =>
  axios.post(`${API_URL}/documents/generate`, { case_data: caseData, selected_doc: selectedDoc })
       .then(res => res.data.document_text);

export const prefetchSuggestions = (caseData) =>
  axios.post(`${API_URL}/documents/suggest`, { case_data: caseData })
       .then(res => res.data.suggestions);

export const generateQuestions = (caseData) =>
  axios.post(`${API_URL}/questions/generate`, { case_data: caseData })
       .then(res => res.data.cards);

export const analyzeQuery = (query) =>
  axios.post(`${API_URL}/analyze`, { query })
       .then(res => res.data); // Returns the full analysis object