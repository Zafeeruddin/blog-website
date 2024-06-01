import axios from "axios"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { savedBlogs, tokenAtom } from "../store/atoms/user"
import { useNavigate } from "react-router-dom"
import { blogOpen } from "../store/atoms/post"
import parse from "html-react-parser"
import { useEffect, useState } from "react"
import { MdBookmarkAdd } from "react-icons/md"
import { blogType } from "../utils/types"


export const Blog=({blog}:blogType)=>{
    const setOpenBlog=useSetRecoilState(blogOpen)
    const navigate=useNavigate()
    const token=useRecoilValue(tokenAtom)
    const [date,setDate]=useState("")
    const [duration]=useState(()=>{const words = blog.content.length;
        const mins = words/200
        return mins
    })        


    const [bookmarkBlogs,setBookMarkBlogs]=useRecoilState(savedBlogs)
    const [,setBookmark]=useState(false)
    const [,setMessage]=useState("")
    const saveBlog=async ()=>{
            if(bookmarkBlogs.includes(blog.id)){
                setBookmark(true) 
                setMessage("Already Bookmarked")
                return
            }
            const headers={
                "Authorization":token
            }
            const response=await axios.put("https://backend.mohammed-xafeer.workers.dev/api/v1/blog/save",{id:blog.id,saved:true},{headers})
            console.log("data",response.data)
            setBookMarkBlogs(response.data)
            setMessage("Saved Blog!") 
        }

    
    
    useEffect(()=>{
        const newDate=new Date(blog.date)
        const year= newDate.getFullYear()
        const date=newDate.getDate()
        const month= newDate.toDateString().substring(4,7)
        setDate(`${month} ${date}, ${year}`)
    },[])


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
        <>
           <div className="lg:m-12 lg:pr-20 lg:pl-20 md:m-10 md:pr-20 md:pl-20 m-2 mb-4 mt-8 border-b pb-4 " >
                <div className="mb-4 flex items-center space-x-4">
                    <div className="bg-gray-500 text-white rounded-full h-8 w-8 flex items-center justify-center"> 
                        <span className="uppercase">{blog.author.name ? blog.author.name[0] : "A"}</span>
                    </div>
                    <div className="font-serif text-lg text-slate-950">{blog.author.name}</div>
                    <div className="flex justify-center content-center mb-2 text-gray-400">.</div>
                    <div className="text-gray-400">Uploaded {date}</div>
                </div>
                <div className="flex ">
                    <div className="w-2/3">
                        <div className="pb-3 font-bold  text-sm text-black lg:text-xl cursor-pointer" onClick={openBlog}>{blog.title}</div>
                        <p className="text-sm lg:text-lg text-gray-400"> {parse(blog.content.substring(0,150))}...</p>
                        <div className="flex space-x-8">
                            <div className="text-gray-400 text-sm">{Math.floor(duration) == 0 ? 1 : Math.floor(duration)} mins read</div>
                            <MdBookmarkAdd onClick={saveBlog}  className="mt-1 w-4 h-4 cursor-pointer"/>
                        </div>
                    </div>
                    <div className="w-1/4 mt-2 ml-10 ">
                        <img  src="https://news.mit.edu/sites/default/files/images/202308/MIT_Astrocyte-Transformer-01-press.jpg" className="h-20"/>
                    </div>
                </div>
            </div>               
        </>
    )
}