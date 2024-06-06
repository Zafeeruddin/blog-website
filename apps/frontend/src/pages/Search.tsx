import { useEffect, useState } from "react"
import { blog } from "../utils/types"
import { Blog } from "../components/Blog"
import { useRecoilState, useRecoilValue } from "recoil"
import { allBlogs, isSearch, searchBlog } from "../store/atoms/user"

export const SearchBlogs=()=>{
    const [filteredBlogs,setFilteredBlogs]=useState<blog[] | null>(null)
    const blogs = useRecoilValue(allBlogs) 
    const search = useRecoilValue(searchBlog)
    const [isSearchBlog,]=useRecoilState(isSearch)

    useEffect(()=>{
        console.log("filtered blogs",filteredBlogs)
        const newBlogs = blogs.filter(blog => blog.title.toLowerCase().includes(search.toLowerCase()))
        setFilteredBlogs(newBlogs)
    },[isSearchBlog,search])

    return (
        <div className="">
            <div className="flex text-5xl text-slate-400 lg:pl-32 lg:pt-4 md:pl-32 md:pt-4 border-b pb-8 font-sans font-bold mt-4 mb-4 ml-2">
                <div >Results for</div>
                <div className="ml-3 text-slate-950">{search}</div>    
            </div>
                {filteredBlogs ?
                    filteredBlogs.map(blog=>{
                        return <Blog key={blog.id} blog={blog}/>
                    })
                    : <></>
                }
        </div>
    )
}