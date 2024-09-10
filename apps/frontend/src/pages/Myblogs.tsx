import {  useRecoilState, useRecoilValue } from "recoil"
import {  allBlogs, imageAtom, userIdAtom, usernameAtom } from "../store/atoms/user"
import { FaLock } from "react-icons/fa"
import { Blog } from "../components/Blog"
import { useEffect, useState } from "react"
import { blog } from "../utils/types"
import { GetProfile } from "../components/user/getProfile"

export const Myblogs=()=>{
    const [filteredBlogs,setFilteredBlogs]=useState<blog[]>([])
    const [blogs,]=useRecoilState(allBlogs)
    const [userId,] = useRecoilState(userIdAtom)
    const googleImage = useRecoilValue(imageAtom)
    const username=useRecoilValue(usernameAtom)

    useEffect(() => {
        console.log("ready to take blogs",userId)
        const newBlogs = blogs.filter(blog => userId===blog.authorId);
        setFilteredBlogs(newBlogs);
        console.log("filtered blogs",filteredBlogs)
        // if(blogs.length!=0){
        //     console.log("blogs in",blogs)
        //     return
        // }
        // // Function to fetch all blogs
        // const getBlogs = async () => {
        //     // Replace with actual fetch call
        //     await getAllBlogs(token,setBlogs);
        //     const newBlogs = blogs.filter(blog => userId===blog.authorId);
        //     console.log("saved are",myBlogsTitles)
        //     console.log("fileterd blogs ",filteredBlogs)
        //     console.log("blogs ",blogs)
        //     setFilteredBlogs(newBlogs);
        // };
        // // Call the function to fetch blogs
        // getBlogs();     
    }, []);


    return(
        <div className="">
            <div className="flex lg:pl-32 md:pl-32 md:pt-20 lg:pt-20 lg:w-2/3">
        <div className="rounded-full h-16 w-16 flex justify-center content-center capitalize text-2xl p-2  text-white">{googleImage && googleImage.length>0 ? 
            <GetProfile  gProfile={googleImage} username={username}></GetProfile> :
            username[0]}</div>
                <div className="ml-4">
                    <div className="capitalize">{username}</div>
                    <div className="flex">
                        <div className="text-gray-400 text-sm">{filteredBlogs.length} stories </div>
                        <FaLock className="text-gray-400 ml-2 w-3 h-3 mt-1" />
                    </div>
                </div>
            </div>
            <div className="text-4xl lg:pl-32 md:pl-32 lg:pt-4 border-b pb-8 font-sans font-extrabold mt-4 mb-4">My Blogs</div>

            {
                filteredBlogs.map(blog=>{
                    return <Blog key={blog.id} blog={blog}/>
                })
            }
            
        </div>
    )
}