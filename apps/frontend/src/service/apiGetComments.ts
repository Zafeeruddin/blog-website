import axios from "axios"
import { blog, comment } from "../utils/types"
import { SetterOrUpdater } from "recoil"

export const getComments=async (token:string,blog:blog,setUserComments:SetterOrUpdater<comment[]>)=>{
    const headers={
        "Authorization":token,
        "id":blog.id
    }
    const response=await axios.get("https://backend.mohammed-xafeer.workers.dev/api/v1/blog/post/comments",{withCredentials:true,headers})
    console.log("comments whne blog ",response.data)
    if(!Array.isArray(response.data)){
        return 
    }
    setUserComments(response.data)
}