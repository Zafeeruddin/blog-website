import {  useEffect, useState } from "react"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import {  allBlogs, notifications, tokenAtom, } from "../store/atoms/user"
import { Blog } from "../components/Blog"
import { blog, comment, Reply,  } from "../utils/types"
import { getAllBlogs } from "../service/apiFetchBlogs"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { blogOpen } from "../store/atoms/post"
import { handleNotificationAtom, handleProfileAtom } from "../store/atoms/handles"
import { List } from "../components/ui/skeletons/listBlogs"
import { handleComment,handleReply } from "../utils/addResponse"


// client.ts
import { hc } from 'hono/client'
import app from "../../../backend/src/index"


export const Blogs=()=>{
    const token=useRecoilValue(tokenAtom)
    const [blogs,setBlogs]=useRecoilState(allBlogs)
    const [trendingBlogs,setTrendingBlogs]=useState<blog[]>([])
    const [loading,setLoading]=useState(true)
    const [,setNotifcation]= useRecoilState(notifications)
    // Close all handles if clicked outside
    const setHandleNotification=useSetRecoilState(handleNotificationAtom)
    const setHandleProfile= useSetRecoilState(handleProfileAtom)
    const closeAllHandles=()=>{
        setHandleNotification(false)
        setHandleProfile(false)
    }

    // create a ws connection
    useEffect(()=>{
        const client = hc<typeof app>('http://localhost:8787')
        // @ts-ignore
        const ws = client.ws.$ws(0)
    
        console.log("reday to connect now",ws)
        ws.onopen = () => {
            console.log('WebSocket connection opened');
            ws.send(JSON.stringify({type:"token",payload:token}))

        };

        ws.onmessage = (event:any) => {
            console.log('Message from server:', event.data);
            
            try{
                const data: Reply|comment = JSON.parse(event.data)
                console.log("data got is " + event.data)
                
                if(data && "reply" in data){
                    console.log("should be replied ")
                    handleReply(event.data,setNotifcation)
                }else if(data && "comment" in data){
                    handleComment(event.data,setNotifcation)
                }
            }catch(e){
                console.error("Error parsing websocker message",e)
            }
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        ws.onerror = (error:any) => {
        console.error('WebSocket error:', error);
        };
    },[])


    // Fetch blogs
    useEffect(() => {
        console.log("ready to take blogs")
        if(blogs.length!=0){
            console.log("blogs in",blogs)
            setLoading(false)
            return
        }
        // Function to fetch all blogs
        const getBlogs = async () => {
            // Replace with actual fetch call
            await getAllBlogs(token,setBlogs);
            setLoading(false)        
        };
        // Call the function to fetch blogs
        getBlogs();     
    }, []);

    // Sort blogs for setting trending blogs
    useEffect(() => {
        if (blogs.length > 0) {
            const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);
            setTrendingBlogs(sortedBlogs.slice(0, 3));
        }
    }, [blogs]);

    return ( 
        <>
        
    { loading ? <List/> : 
    <div className="lg:flex"  onClick={closeAllHandles}>
        
        <div className="border-r">
            {blogs.map(blog=>{
                return <Blog key={blog.id} blog={blog}/>
            })} 
        </div>
        <div className="mt-4 m-4 pt-8 hidden lg:block ">
            <div className="text-2xl mb-8 flex text-slate-950 ">Trending Blogs</div>
            {trendingBlogs.map((blog)=>{return <TrendBlog blog={blog} key={blog.id}/> })}
        </div>
    </div>
}
 </>
    )
}

const TrendBlog=({blog}:{blog:blog})=>{
    const navigate=useNavigate()
    const token=useRecoilValue(tokenAtom)
    const setOpenBlog=useSetRecoilState(blogOpen)
    const openBlog=async ()=>{
        const blogId=blog.id
        const headers={
            Authorization:token
        }
        try{
            const response=await axios.get(`https://backend.mohammed-xafeer.workers.dev/api/v1/blog/${blogId}`,{withCredentials:true,headers})
            console.log("blog got is ",response.data)
            setOpenBlog(response.data)
            navigate(`/blogs/${response.data.id}`)
        }catch(e){
            return
        }
    }

    return (
        <div className="  border-b mb-2 pb-1 font-serif text-lg cursor-pointer " onClick={openBlog}>
            {/* <div>{index}. </div> */}
            <div className="flex mb-2">
                <div className="rounded-full text-sm capitalize w-6 h-6 flex justify-center content-center text-white p-1 bg-orange-950 mt-1">{blog.author.name[0]}</div>
                <div className="ml-2 -space-y-1 capitalize  text-lg font-sans ">{blog.author.name}</div>
            </div>
            <div className="font-semibold">{blog.title}</div>
        </div>
    )
}