import axios from 'axios';
import { BASE_API_URL } from './constants';

const instance = axios.create({
  baseURL: BASE_API_URL,
  timeout: 15000,
});

export default instance;
