import axios from "axios"
import { SetterOrUpdater } from "recoil"

export const verifyOtp=async (otp:number,setSuccess:SetterOrUpdater<boolean>)=>{
    const response = await axios.post(`${process.env.BACKEND_PROD_URL}/api/v1/user/checkOTP`,{otp},{withCredentials:true})
    if (response.status===202){
        setSuccess(true)
    }else if(response.status===406){
        setSuccess(false)
    }
}