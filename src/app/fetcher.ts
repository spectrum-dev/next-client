import axios from 'axios';

// eslint-disable-next-line prefer-destructuring
const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const fetcher = axios.create({
  baseURL: REACT_APP_API_BASE_URL,
  headers: {
    Authorization: localStorage.getItem('accessToken') ? `Bearer ${localStorage.getItem('accessToken')}` : '',
  },
});

export default fetcher;
