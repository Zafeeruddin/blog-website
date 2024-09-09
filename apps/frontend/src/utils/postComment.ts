import { SetterOrUpdater} from "recoil"
import axios from "axios"
import { blog, comment } from "./types"


export const publishComment=async (token:string,blog:blog,comment:string,setUserComments:SetterOrUpdater<comment[]>)=>{
    const headers={
        "Authorization":token,
    }
    const body={
        "id":blog.id,
        "comment":comment
    }
    console.log("comment id ",blog.id)
    try{
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_PROD_URL}/api/v1/blog/post/comments`,body,{withCredentials:true,headers})   
        setUserComments(response.data)
    }catch(e){
        console.log(e)
    }
    console.log("publish")
}
