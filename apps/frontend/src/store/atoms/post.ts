import { atom, selector, useRecoilValue } from "recoil"
import {  tokenAtom } from "./user"
import axios from "axios"
import { Reply, blog, comment } from "../../utils/types"
import {recoilPersist} from "recoil-persist"
const {persistAtom} = recoilPersist()

export  const titleAtom=atom({
    key:"title",
    default:"",
    effects_UNSTABLE:[persistAtom]
})

export  const contentAtom=atom({
    key:"content",
    default:"",
    effects_UNSTABLE:[persistAtom]
})


const date=new Date()

export const blogOpen=atom<blog>({
    key:"openBlog",
    default:{authorId:"",title:"",content:"",published:true,id:"",date:date,likes:0, author:{name:"",id:""}},
    effects_UNSTABLE:[persistAtom]
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
        const response = await axios.get("https://backend.mohammed-xafeer.workers.dev/api/v1/blog/post/comments",{withCredentials:true,headers})
        
        console.log("comments are",response.data)
         return response.data
    }
    
})


export const comments=atom<comment[]>({
    key:"comments",
    default:defaultComments,
    effects_UNSTABLE:[persistAtom]
})

export const replies=atom<Reply[]>({
    key:"replies",
    default:[],
    effects_UNSTABLE:[persistAtom]
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