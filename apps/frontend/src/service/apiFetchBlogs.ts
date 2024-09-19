import axios from "axios";
import { SetterOrUpdater } from "recoil";
import { blog } from "../utils/types";

export const getAllBlogs=async (setBlogs:SetterOrUpdater<blog[]>)=>{

    try{
        const getBlogs=await axios.get(`${import.meta.env.VITE_BACKEND_PROD_URL}/api/v1/blog/blogs/bulk`,{withCredentials:true})
        const response=getBlogs.data  
        console.log("blogs.........",response)
        setBlogs(response)
    }catch(e){
        console.log(e)
        return
    }
}