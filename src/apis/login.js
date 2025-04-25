import axios from 'axios'
import { BACKEND_URL } from '../config/config'

export const apiLogin = (credential) =>
  axios.post(`${BACKEND_URL}/auth/login`, { credential })
