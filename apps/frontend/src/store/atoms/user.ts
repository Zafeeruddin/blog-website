import axios from "axios";
import { atom, selector, useRecoilValue } from "recoil";
import {  Notification, UnifiedNotification, blog } from "../../utils/types";
import {recoilPersist} from "recoil-persist"
const {persistAtom} = recoilPersist()
export const allBlogs=atom<blog[]>({
    key:"allBlogs",
    default:[],
    effects_UNSTABLE:[persistAtom]
})


export const filteredBlogs=atom<blog[]>({
    key:"filterBlogs",
    default:[],
    effects_UNSTABLE:[persistAtom]
})

export const searchBlog=atom<string>({
    key:"search",
    default:"",
    effects_UNSTABLE:[persistAtom]
})


export  const usernameAtom=atom<string>({
    key:"username",
    default:"",
    effects_UNSTABLE:[persistAtom]
})

export  const emailAtom=atom({
    key:"email",
    default:"",
    effects_UNSTABLE:[persistAtom]
})

export  const passwordAtom=atom({
    key:"password",
    default:"",
    effects_UNSTABLE:[persistAtom]
})

export const tokenAtom=atom({
    key:"atom",
    default:"",
    effects_UNSTABLE:[persistAtom]
})

export const defaultSavedBlogs=selector<string[]>({
    key:"defaultSavedPosts",
    get:async ()=>{
        try{
            // const headers={
            //     "Authorization":get(tokenAtom)
            // }
            // https://backend.mohammed-xafeer.workers.dev
            const response=await axios.get("https://backend.mohammed-xafeer.workers.dev/api/v1/blog/save/posts",{withCredentials:true})
            console.log("response data",response.data)
            return response.data
        }catch(e){
            return []
        }
        
    }
})


export const defaultLikedBlogs=selector<string[]>({
    key:"defaultLikedPosts",
    get:async ()=>{
        try{
            const token=useRecoilValue(tokenAtom)
            console.log("token got is ",token)
            // const headers={
            //     "Authorization":get(tokenAtom)
            // }
            const response=await axios.get("https://backend.mohammed-xafeer.workers.dev/api/v1/blog/like/posts",{withCredentials:true})
            console.log("liked are",response.data)
            return response.data
        }catch(e){
            return []
        }
        
    }
})


export const likedBlogs=atom<string[]>({
    key:"likedBlogs",
    default:defaultLikedBlogs,
    effects_UNSTABLE:[persistAtom]
})


export const savedBlogs=atom<string[]>({
    key:"savedBlogs",
    default:defaultSavedBlogs,
    effects_UNSTABLE:[persistAtom]
})

export const filtered=atom<blog[]>({
    key:"filteredBlogs",
    default:[],
    effects_UNSTABLE:[persistAtom]
})




export const getUserNotifications=selector<Notification>({
    key:"defualtNotifications",
    get:async ()=>{
        try{
            
            const response=await axios.get("https://backend.mohammed-xafeer.workers.dev/api/v1/user/getNotification",{withCredentials:true})
            console.log("notifications are ",response.data)
            const isArray= Array.isArray(response.data)
            if(isArray){
                return response.data
            }
        }catch(e){
            return []
        }
        
    }
})

export const notifications=atom<Notification>({
    key:"notification",
    default:getUserNotifications,
    effects_UNSTABLE:[persistAtom]
})

export const unifiedNotificationsAtom=atom<UnifiedNotification[]>({
    key:"unifiedNotificaiton",
    default:[],
    effects_UNSTABLE:[persistAtom]
})


export const areNotifications = atom<boolean>({
    key:"notificationIn",
    default:false,
    effects_UNSTABLE:[persistAtom]
})

export const isSearch = atom<boolean>({
    key:"isSearch",
    default:false
})

export const fetchUser=selector<boolean>({
    key:"fetchUser",
    get:async ({get})=>{
        try{
            const headers={
                "Authorization":get(tokenAtom)
            }
            const response=await axios.get("https://backend.mohammed-xafeer.workers.dev/api/v1/blog",{withCredentials:true,headers})
            if (response.status==401){
                return false
            }else{
                return true
            }
        }catch(e){
            return false
        }
        
    }
})




export const isAuthenticated = atom<boolean>({
    key:"isAuth",
    default:fetchUser,
    effects_UNSTABLE:[persistAtom]
})