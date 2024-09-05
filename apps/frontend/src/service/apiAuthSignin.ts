import axios, { AxiosError } from "axios"
import { NavigateFunction } from "react-router-dom";
import { SetterOrUpdater } from "recoil"
import { toast } from "sonner";
import Cookies from "js-cookie"

export const userSignIn=async (email:string,password:string,setUsername:SetterOrUpdater<string>,setToken:SetterOrUpdater<string>,navigate:NavigateFunction,setUserAuth:SetterOrUpdater<boolean>,setGoogleImage:SetterOrUpdater<string>)=>{
  let loadingToastId; 
  console.log("signnin")
  try{
        loadingToastId = toast.loading("Signing in...");
        const response=await axios.post(`${import.meta.env.VITE_BACKEND_PROD_URL}/api/v1/user/signin`,{email:email,password:password},{withCredentials:true})
        if(response.data.token){
          toast.dismiss(loadingToastId);
          toast.success("Sign-in successful");
          setToken(response.data.token)
          setUsername(response.data.name)
          console.log("token being set", response.data.token)
          setUserAuth(true)
          setGoogleImage(response.data.googleImage)
          navigate("/blogs")
        }else{
          console.log("throwing err",response.data.e)
          toast.dismiss(loadingToastId);
          toast.error(response.data.msg)
          return 
        }
      }catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          // Type assertion to AxiosError
          const axiosError = error as AxiosError;
          if (axiosError.response) {
            const status = axiosError.response.status
            if(status===400){
              toast.dismiss(loadingToastId)
              toast.error("Inputs are incorrect")
            }else if(status===403){
              toast.dismiss(loadingToastId)
              toast.error("user doesn't exists")
            }else if(status===404){
              toast.dismiss(loadingToastId)
              toast.error("Incorrect password")
            }
          } else {
            // Something happened in setting up the request that triggered an error
            console.error("Error:", axiosError.message);
          }
        } else {
          // Handle other types of errors
          console.error("Non-Axios error:", error);
        }
      }
}

export const userSignOut=async(setUserAuth:SetterOrUpdater<boolean>)=>{
  const loading= toast.loading("Signing out...")
  try{
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_PROD_URL}/api/v1/user/signout`,{withCredentials:true})
    console.log("got response ",response.data)
    if(response.status==200){
      toast.dismiss(loading)
      toast.success(response.data)
      setUserAuth(false)
      
      localStorage.removeItem('recoil-persist');  // This assumes the default key used by recoil-persist
      Cookies.remove('token');

    }
  }catch(E){
    toast.error("Error signing out")
  }
}

export const isUserAuth =async ()=>{
  try{
    
    const response=await axios.get(`${import.meta.env.VITE_BACKEND_PROD_URL}/api/v1/blog`,{withCredentials:true})
    if (response.status==401){
        return false
    }else{
        return true
    }
  }catch(e){
    return false
  }

}

export const googleSignIn =async (setToken:SetterOrUpdater<string>,googleToken:string,googleId:string,email:string,name:string,googleImage:string)=>{
  console.log("ready to sing in")
  console.log("googleImage is",googleImage)
    const response=await axios.post(`${import.meta.env.VITE_BACKEND_PROD_URL}/api/v1/user/googleAuth`,{googleToken:googleToken,googleId:googleId,email:email,name:name,googleImage:googleImage})
    console.log("response after google",response.data)
    setToken(response.data.token)
    return
}