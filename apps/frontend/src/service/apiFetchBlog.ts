import axios from "axios"
import { SetterOrUpdater } from "recoil"
import { blog } from "../utils/types"
import { NavigateFunction } from "react-router-dom"

export const openBlog=async (blogId:string,setOpenBlog:SetterOrUpdater<blog>,navigate:NavigateFunction,isComment:boolean,commentId:string)=>{
    
    try{
        console.log("ready to fetch")
        const response=await axios.get(`${import.meta.env.VITE_BACKEND_PROD_URL}/api/v1/blog/${blogId}`,{withCredentials:true})
        console.log("blog got is ",response.data + commentId)
        setOpenBlog(response.data)
        navigate(isComment ? `/blogs/${response.data.id}#comments` :  `/blogs/${response.data.id}`)
    }catch(e){
        return
    }
}
