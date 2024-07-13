import axios from "axios"

export const updateNotification=async (token:string)=>{
    const headers={
        "Authorization":token,
    }
    const response=await axios.put("https://backend.mohammed-xafeer.workers.dev/api/v1/user/getNotification",{withCredentials:true,headers})
    console.log("noitifcaitons updated",response.data) 
}

