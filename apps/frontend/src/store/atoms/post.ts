import { atom, selector, useRecoilValue } from "recoil"
import {  tokenAtom } from "./user"
import axios from "axios"
import { Reply, blog, comment } from "../../utils/types"

export  const titleAtom=atom({
    key:"title",
    default:""
})

export  const contentAtom=atom({
    key:"content",
    default:""
})


const date=new Date()

export const blogOpen=atom<blog>({
    key:"openBlog",
    default:{authorId:"",title:"",content:"",published:true,id:"",date:date,likes:0, author:{name:"",id:""}}
})


export const defaultComments=selector<comment[]>({
    key:"defaultComments",
    get:async ({get})=>{
        const blog=useRecoilValue(blogOpen)
        const headers={
            "Authorization":get(tokenAtom),
            "id":blog.id
        }
        console.log("vlog id",blog.id)
        console.log("getting comments")
        const response = await axios.get("https://backend.mohammed-xafeer.workers.dev/api/v1/blog/post/comments",{withCredentials:true})
        
        console.log("comments are",response.data)
         return response.data
    }
    
})


export const comments=atom<comment[]>({
    key:"comments",
    default:defaultComments
})

export const replies=atom<Reply[]>({
    key:"replies",
    default:[]
})

export const currentCommentId=atom<string>({
    key:"commentCurrent",
    default:""
})
export const userComment=atom<string>({
    key:"comment",
    default:""
})

export const relevantComment=atom<boolean>({
    key:"relevant",
    default:true
})

export const cancelComment=atom<boolean>({
    key:"cancel",
    default:false
})



export const usernameReply=atom<string>({
    key:"usernameReply",
    default:""
})

export const handleReply=atom<boolean>({
    key:"handleReply",
    default:false
})