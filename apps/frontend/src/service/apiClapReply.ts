import axios from "axios"
import { Dispatch, SetStateAction } from "react"

export const clapReplyOnce=async (token:string,replyId:string,commentId:string,setClapped:Dispatch<SetStateAction<number>>)=>{
    console.log("ready to clap",commentId)
    const headers={
        "Authorization":token,
    }
    const body={
        "id":replyId,
        "commentId":commentId
    }
    try{
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_PROD_URL}/api/v1/blog/post/replies`,body,{withCredentials:true,headers})
        console.log("rspon",response.data)
        setClapped(response.data.claps)
    }catch(e){
        console.log(e)
    }
}
