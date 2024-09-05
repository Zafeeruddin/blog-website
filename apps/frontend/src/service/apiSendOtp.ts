import axios from "axios"
import { toast } from "sonner"

export const sendOtp=async (email:string)=>{
    let loadingToastId = toast.loading("Sending OTP...")
    try{
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_LOCAL_URL}/api/v1/user/sendOTP`,{email},{withCredentials:true})
        console.log("status is ",response.status)
        console.log("json si ",response.data)
        if (response.status===201){
            toast.dismiss(loadingToastId)
            toast.message("OTP sent to " + email)
            console.log("sent the main ")
            return true
        }
    }catch(E){
        toast.dismiss(loadingToastId)
        toast.error("Error sending OTP")
        return false
      }
    }
