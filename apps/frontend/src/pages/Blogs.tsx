import {  useEffect, useState } from "react"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import {  allBlogs, tokenAtom } from "../store/atoms/user"
import { Blog } from "../components/Blog"
import { Layout } from "../components/ui/layout"
import { blog,  } from "../utils/types"
import { getAllBlogs } from "../service/apiFetchBlogs"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { blogOpen } from "../store/atoms/post"
import { handleNotificationAtom, handleProfileAtom } from "../store/atoms/handles"

export const Blogs=()=>{
    const token=useRecoilValue(tokenAtom)
    // const [filter,setFilter]=useState("")
    // const [filteredBlogs,setFilteredBlogs]=useState([
    //     { authorId:"",
    //     title:"",
    //     published:false,
    //     content:"",
    //     id:""}])

    const [blogs,setBlogs]=useRecoilState(allBlogs)
    const [trendingBlogs,setTrendingBlogs]=useState<blog[]>([])
    
    // Close all handles if clicked outside
    const setHandleNotification=useSetRecoilState(handleNotificationAtom)
    const setHandleProfile= useSetRecoilState(handleProfileAtom)
    const closeAllHandles=()=>{
        setHandleNotification(false)
        setHandleProfile(false)
    }

    useEffect(() => {
        // Function to fetch all blogs
        const getBlogs = async () => {
            // Replace with actual fetch call
            await getAllBlogs(token,setBlogs);        };

        // Call the function to fetch blogs
        getBlogs();
    }, []);

    useEffect(() => {
        // Sort and set the trending blogs once blogs state is updated
        if (blogs.length > 0) {
            const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);
            setTrendingBlogs(sortedBlogs.slice(0, 3));
        }
    }, [blogs]);

    useEffect(() => {
        // Log trending blogs whenever they are updated
        console.log("trending blogs", trendingBlogs);
    }, [trendingBlogs]);


    // const getFilteredBlogs=()=>{
    //     const getAllBlogs=blogs.forEach((blog)=>{if(blog.title.includes(filter)){filteredBlogs.push(blog)}})
    // }

    return (
        <>
        
    <Layout/> 
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
            const response=await axios.get(`https://backend.mohammed-xafeer.workers.dev/api/v1/blog/${blogId}`,{headers})
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