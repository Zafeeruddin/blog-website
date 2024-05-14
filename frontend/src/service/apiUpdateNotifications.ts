import axios from "axios"

export const updateNotification=async (token:string)=>{
    const headers={
        "Authorization":token,
    }
    console.log("updating reaady",headers)
    const response=await axios.put("https://backend.mohammed-xafeer.workers.dev/api/v1/user/getNotification",{},{headers})
    console.log("noitifcaitons updated",response.data) 
}

