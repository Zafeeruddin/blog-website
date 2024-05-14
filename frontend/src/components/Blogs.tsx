import axios from "axios"
import { useEffect } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import {  allBlogs, tokenAtom } from "../store/atoms/user"
import { Blog } from "./Blog"
import { Layout } from "./ui/layout"

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
    useEffect( ()=>{
    
        const getAllBlogs=async ()=>{
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': token
              };
            try{
                console.log("token value",token )
                const getBlogs=await axios.get("https://backend.mohammed-xafeer.workers.dev/api/v1/blog/blogs/bulk",{headers})
                const response=getBlogs.data
                
                setBlogs(response)
                return response
            }catch(e){
                return
            }
        }
        getAllBlogs()
    },[])

    // const getFilteredBlogs=()=>{
    //     const getAllBlogs=blogs.forEach((blog)=>{if(blog.title.includes(filter)){filteredBlogs.push(blog)}})
    // }

    return (
        <>
        
    <Layout/> 
    
    <div>
        {blogs.map(blog=>{
            return <Blog key={blog.id} blog={blog}/>
        })}
        
    </div>
    
 </>
    )
}