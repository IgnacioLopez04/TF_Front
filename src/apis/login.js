import axios from 'axios';
import { BACKEND_AUTH_URL } from '../config/config';

export const apiLogin = (credential) =>
   axios.post(`${BACKEND_AUTH_URL}/auth/login`, { credential });
