import axios from "axios"
import { Dispatch, SetStateAction } from "react"
import { blog } from "../utils/types"

export const clapOnce=async (token:string,blog:blog,commentId:string,setClapped:Dispatch<SetStateAction<number>>)=>{
    console.log("ready to clap")
    const headers={
        "Authorization":token,
    }
    const body={
        "id":blog.id,
        "commentId":commentId
    }
    try{
        const response = await axios.put("https://backend.mohammed-xafeer.workers.dev/api/v1/blog/post/comments",body,{withCredentials:true,headers})
        console.log("rspon",response.data)
        setClapped(response.data.claps)
    }catch(e){
        console.log(e)
    }
}
