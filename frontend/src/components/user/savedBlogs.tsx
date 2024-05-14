import { useRecoilState, useRecoilValue } from "recoil"
import { allBlogs, filtered, savedBlogs } from "../../store/atoms/user"
import { Blog } from "../Blog"
import { useEffect } from "react"

export const SavedBlogs=()=>{
    const blogs=useRecoilValue(allBlogs)
    const savedBlog=useRecoilValue(savedBlogs)
    const [filteredBlogs,setFilteredBlogs]=useRecoilState(filtered)
    useEffect(()=>{
        setFilteredBlogs(blogs.filter(blog=>savedBlog.includes(blog.id)))
    },[])
    return (
        <>
            {
                filteredBlogs.map(blog=>{
                    return <Blog blog={blog}/>
                })
            }
        </>
    )
}
