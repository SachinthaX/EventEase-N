import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000', // your backend port
  withCredentials: true, // optional, if using cookies or Google login
});

export default instance;
