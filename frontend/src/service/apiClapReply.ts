import axios from "axios"
import { Dispatch, SetStateAction } from "react"

export const clapReplyOnce=async (token:string,replyId:string,setClapped:Dispatch<SetStateAction<number>>)=>{
    console.log("ready to clap")
    const headers={
        "Authorization":token,
    }
    const body={
        "id":replyId,
    }
    try{
        const response = await axios.put("https://backend.mohammed-xafeer.workers.dev/api/v1/blog/post/replies",body,{headers})
        console.log("rspon",response.data)
        setClapped(response.data.claps)
    }catch(e){
        console.log(e)
    }
}
