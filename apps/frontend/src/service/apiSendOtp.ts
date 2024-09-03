import axios from "axios"
import { SetterOrUpdater } from "recoil"

export const sendOtp=async (email:string,setSuccess:SetterOrUpdater<boolean>)=>{
    const response = await axios.post(`${process.env.BACKEND_PROD_URL}/api/v1/user/sendOtp`,{email},{withCredentials:true})
    if (response.status===201){
        setSuccess(true)
        return
    }else if(response.status===404){
        setSuccess(false)
        return
    }
}