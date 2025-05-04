import PropTypes from 'prop-types'
import { createContext, useState } from "react";
import { apiLogin } from "../apis/login.js";
import { toast } from "react-toastify";
import Cookies from 'js-cookie'


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [authenticated, setAuthenticated] = useState(false)

  const login = async (credential) =>{
    try{
      const user = await apiLogin(credential)
      setUser(user.data)
      setAuthenticated(true)
    }catch(err){
      toast.error('No es posible iniciar sesión')
      console.error(err)
    }
  }

  const logout = async ()=>{
    Cookies.remove('access_token')
    setUser(null)
    setAuthenticated(false)
  }

  return (
    <AuthContext.Provider
      value={{ user, authenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}