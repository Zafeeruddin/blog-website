import axios, { AxiosError } from "axios"
import { NavigateFunction } from "react-router-dom";
import { SetterOrUpdater } from "recoil"
import { toast } from "sonner";


export const userSignIn=async (email:string,password:string,setUsername:SetterOrUpdater<string>,setToken:SetterOrUpdater<string>,navigate:NavigateFunction)=>{
  let loadingToastId;  
  try{
        loadingToastId = toast.loading("Signing in...");
        const response=await axios.post("https://backend.mohammed-xafeer.workers.dev/api/v1/user/signin",{email:email,password:password})
        // const response=await axios.post("http://127.0.0.1:8787/api/v1/user/signin",{email:email,password:password})

        if(response.data.token){
          toast.dismiss(loadingToastId);
          toast.success("Sign-in successful");
          setToken(response.data.token)
          setUsername(response.data.name)
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