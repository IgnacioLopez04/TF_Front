import { GoogleLogin } from "@react-oauth/google";
import { apiLogin } from "../apis/login.js";
import { toast } from "react-toastify";

export function Login(){
  const handleLoginSuccess = async (credentialResponse) => {

    const { credential } = credentialResponse
    try{
      const user = await apiLogin(credential)

      const {access_token} = user.data
      localStorage.setItem('access_token', access_token)
      toast.success("Login successful")
    }catch(err){
      toast.error(err.message)
    }
  }


  return (
    <div className="login">
      <h1>Login</h1>
     <GoogleLogin
      onSuccess={handleLoginSuccess}
     ></GoogleLogin>
    </div>
  );
}