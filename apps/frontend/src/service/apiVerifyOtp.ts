import axios from "axios"
import { SetterOrUpdater } from "recoil"
import { toast } from "sonner";

export const verifyOtp=async (otp:number,setSuccess:SetterOrUpdater<boolean>)=>{
    let loadingToastId;
    try{
        loadingToastId = toast.loading("Verifying OTP")
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_LOCAL_URL}/api/v1/user/checkOTP`,{otp})
        if (response.status===202){
            toast.dismiss(loadingToastId)
            setSuccess(true)
            return true
        }
    }catch(e){
        toast.dismiss(loadingToastId)
        toast.error("Incrrect OTP")
        setSuccess(false)
        return false
    }
}