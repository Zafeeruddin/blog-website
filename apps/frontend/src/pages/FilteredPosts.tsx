import {  useRecoilValue } from "recoil"
import {  allBlogs, savedBlogs, usernameAtom } from "../store/atoms/user"
import { FaLock } from "react-icons/fa"
import { Blog } from "../components/Blog"
import { useEffect, useState } from "react"
import { blog } from "../utils/types"

export const FilteredPosts=()=>{
    const savedBlogsTitles=useRecoilValue(savedBlogs)
    const [filteredBlogs,setFilteredBlogs]=useState<blog[]>([])
    const blogs=useRecoilValue(allBlogs)
    useEffect(()=>{
        if (savedBlogsTitles.length===0){
            const newBlogs:blog[] = []
            setFilteredBlogs(newBlogs)
        }else{
            console.log("saved are",savedBlogsTitles)
            const newBlogs = blogs.filter(blog => savedBlogsTitles.includes(blog.id));
            setFilteredBlogs(newBlogs);
        }
    },[blogs,savedBlogs])
    const username=useRecoilValue(usernameAtom)
    return(
        <div className="">
            <div className="flex lg:pl-32 md:pl-32 md:pt-20 lg:pt-20 lg:w-2/3">
                <div className="rounded-full h-12 w-12 flex justify-center content-center capitalize text-2xl p-2 bg-orange-900 text-white">{username[0]}</div>
                <div className="ml-4">
                    <div className="capitalize">{username}</div>
                    <div className="flex">
                        <div className="text-gray-400 text-sm">{filteredBlogs.length} stories </div>
                        <FaLock className="text-gray-400 ml-2 w-3 h-3 mt-1" />
                    </div>
                </div>
            </div>
            <div className="text-4xl lg:pl-32 md:pl-32 lg:pt-4 border-b pb-8 font-sans font-extrabold mt-4 mb-4">Reading list</div>

            {
                filteredBlogs.map(blog=>{
                    return <Blog key={blog.id} blog={blog}/>
                })
            }
            
        </div>
    )
}