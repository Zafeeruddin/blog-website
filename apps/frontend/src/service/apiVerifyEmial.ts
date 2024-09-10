import axios from "axios"

export const verifyEmail= async(email:string)=>{

    try{
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_PROD_URL}/api/v1/user/checkEmail`,{email},{withCredentials:true})
        console.log("Status is " + response.status)
        console.log("Check is " + response.data)
        if(response.status===200){
        return true
        }
    }catch(e){
        return false
    }
    
}