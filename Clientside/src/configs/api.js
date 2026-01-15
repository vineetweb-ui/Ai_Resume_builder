import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ai-resume-builder-jqo6.onrender.com'
});

export default api;
