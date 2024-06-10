import axios from "axios";
import { SetterOrUpdater } from "recoil";
import { blog } from "../utils/types";

export const getAllBlogs=async (token:string,setBlogs:SetterOrUpdater<blog[]>)=>{
    // const headers = {
    //     'Content-Type': 'application/json',
    //     'Authorization': token
    //   };
    try{
        console.log("token value",token )
        const getBlogs=await axios.get("https://backend.mohammed-xafeer.workers.dev/api/v1/blog/blogs/bulk",{withCredentials:true})
        const response=getBlogs.data  
        setBlogs(response)
        console.log("response",response)
    }catch(e){
        return
    }
}