import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ai-resume-builder-v2q4.onrender.com'
});

export default api;