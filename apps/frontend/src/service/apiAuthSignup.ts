import axios, { AxiosError } from "axios"
import { NavigateFunction } from "react-router-dom";
import { SetterOrUpdater } from "recoil"
import { toast } from "sonner";


export const userSignUp=async (username:string,email:string,password:string,setUsername:SetterOrUpdater<string>,setToken:SetterOrUpdater<string>,navigate:NavigateFunction,setUserAuth:SetterOrUpdater<boolean>,setUserId:SetterOrUpdater<string>)=>{
  let loadingToastId;  
  try{

        loadingToastId = toast.loading("Signing up...");
        const response=await axios.post(`${import.meta.env.VITE_BACKEND_PROD_URL}/api/v1/user/signup`,{name:username,email:email,password:password},{withCredentials:true})
        if(response.data.token){
          toast.dismiss(loadingToastId);
          toast.success("Sign-in successful");
          setToken(response.data.token)
          setUsername(response.data.name)
          console.log("token being set", response.data.token)
          setUserAuth(true)
          console.log("id ...................",response.data.id)
          setUserId(response.data.id)
          navigate("/blogs")
        }else{
          console.log("throwing err",response.data)
          toast.dismiss(loadingToastId);
          toast.error("Incorrect inputs")
          return 
        }
      }catch (error: unknown) {
        console.log("err",error)
        if (axios.isAxiosError(error)) {
          // Type assertion to AxiosError
          const axiosError = error as AxiosError;
          if (axiosError.response) {
            const status = axiosError.response.status
            if(status===400){
              toast.dismiss(loadingToastId)
              toast.error("Inputs are incorrect")
            }else if(status===404){
              toast.dismiss(loadingToastId)
              toast.error("Incorrect password")
            } else if(status===409){
              toast.dismiss(loadingToastId)
              toast.error("Email already exists")
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