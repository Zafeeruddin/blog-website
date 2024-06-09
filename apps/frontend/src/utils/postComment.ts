import { SetterOrUpdater} from "recoil"
import axios from "axios"
import { blog, comment } from "./types"


export const publishComment=async (token:string,blog:blog,comment:string,setUserComments:SetterOrUpdater<comment[]>)=>{

    console.log("ready to publish")
    const headers={
        "Authorization":token,
    }
    const body={
        "id":blog.id,
        "comment":comment
    }
    console.log("comment id ",blog.id)
    try{
    // const response = await axios.post("https://backend.mohammed-xafeer.workers.dev/api/v1/blog/post/comments",body,{headers})
    const response = await axios.post("http://127.0.0.1:8787/api/v1/blog/post/comments",body,{headers})
    console.log("comment is published...")
    
    setUserComments(response.data)
    console.log("rspon",response.data)
    }catch(e){
        console.log(e)
    }
    console.log("publish")
}
