import { useRecoilState, useRecoilValue } from "recoil"
import { blogOpen } from "../store/atoms/post"
import { Layout } from "../components/ui/layout"
import { AiOutlineLike,AiFillLike,} from "react-icons/ai";
import {MdBookmarks,MdOutlineBookmarks } from "react-icons/md"
import ReactHTMLParser from "react-html-parser"
import { useEffect, useState } from "react";
import { likedBlogs, savedBlogs, tokenAtom } from "../store/atoms/user";
import axios from "axios";
import { Comments } from "../components/comments/Comments";

export const OpenBlog=()=>{
    
    const [flag,setFlag]=useState(true)
    const token=useRecoilValue(tokenAtom)
    const blog=useRecoilValue(blogOpen)
    const [bookmarkBlogs,setBookMarkBlogs]=useRecoilState(savedBlogs)
    const [likeBlogs,setLikeBlogs]=useRecoilState(likedBlogs)
    const [like,setLike]=useState(()=>{ return likeBlogs.includes(blog.id) ? true : false})
    const [likes,setLikes]=useState(()=>{return blog.likes})
    const [bookmark,setBookmark]=useState(()=>{return bookmarkBlogs.includes(blog.id) ? true:false})
    const [date,setDate]=useState("")
    const [isImage,setIsImage]=useState(false)

    // const imageUrl = `https://pub-1fab6c2575d44e75bf69e0d8827f0a72.r2.dev/blog-website%2F${blog.id}.png`;

    // useEffect(() => {
    //     const checkImage = async () => {
    //     try {
    //         const response = await fetch(imageUrl);
    //         if (response.ok) {
    //         setIsImage(true);
    //         } else {
    //         setIsImage(false);
    //         }
    //     } catch (error) {
    //         setIsImage(false);
    //     }
    //     };

    //     checkImage();
    // }, [imageUrl]);
    // Convert date into '5 May, 2024' format
    useEffect(()=>{
        const newDate=new Date(blog.date)
        const year= newDate.getFullYear()
        const date=newDate.getDate()
        const month= newDate.toDateString().substring(4,7)
        setDate(`${month} ${date}, ${year}`)
    },[])
    
    useEffect(()=>{
        console.log("blog",blog)
        setFlag(false)
        console.log("set flag now")
    },[])

    const headers={
        "Authorization":token
    }
    
    // Save/Unsave blog
    const [newBookmarks,setNewBookmarks]=useState(bookmarkBlogs)
    useEffect(()=>{
        console.log("triggerd",bookmark)
        const saveBlog=async ()=>{
            const response=await axios.put("https://backend.mohammed-xafeer.workers.dev/api/v1/blog/save",{id:blog.id,saved:bookmark},{headers})
            console.log("data",response.data)
            setNewBookmarks(response.data)
        }

        setBookMarkBlogs([...newBookmarks])
        if(!flag){
            console.log(flag)
            saveBlog()
        }
    },[bookmark])

    // Liking/disliking blog
    const [newLikedBlogs,setNewLikeBlogs]=useState(likeBlogs)
    useEffect(()=>{
        console.log("liked is ",like)

        const updateLikePosts=async ()=>{
            console.log("ready to like",blog.likes)
            const response=await axios.put("https://backend.mohammed-xafeer.workers.dev/api/v1/blog/like",{id:blog.id,liked:like},{headers})
            const data=response.data
            console.log("new likes",data)
            setNewLikeBlogs(data.posts)
            setLikes(data.likes)
            console.log(data.likes)
        }
        
        if(!flag){
            setLikeBlogs([...newLikedBlogs])
            updateLikePosts()
        }
    },[like])

    // saving/liking for icons
    const likeBlog= async ()=>{
        setLike(!like)
    }
    const saveBlog=()=>{
        setBookmark(!bookmark)
    }
    const [duration]=useState(()=>{const words = blog.content.length;
        const mins = words/200
        return mins
    })
    
    return (
        <>
            <Layout/>
            <div className="p-4 lg:p-16 lg:pl-80 lg:pr-80 md:p-20 -z-10 ">
                <div className="text-4xl md:text-2xl lg:text-5xl font-serif font-bold mb-10 text-slate-950 ">{blog.title}</div>
                <div className="mb-4  flex items-center space-x-4 pb-10 border-b">
                        <div className="bg-gray-500 text-white rounded-full h-16 w-16 text-4xl flex items-center justify-center"> 
                            <span className="uppercase">{blog.author?blog.author.name[0] : "A"}</span>
                        </div>
                        <div>
                            <div className="font-sans text-lg text-slate-950 capitalize">{blog.author ? blog.author.name:  "Ananoymous"}</div>
                            <div className="flex">
                                <div className="text-gray-400 text-sm">{Math.floor(duration) == 0 ? 1 : Math.floor(duration)} mins read</div>
                                <div className="flex justify-center content-center ml-4 mb-2 ">.</div>
                                <div className="text-gray-400 ml-4 text-sm ">{date}</div>
                            </div>
                        </div>

                        <div onClick={likeBlog} className="cursor-pointer space-y-1 flex space-x-2">
                            <div>{blog.likes==0 ? "" :likes}</div>
                            <div> {like==true ?<AiFillLike/> : <AiOutlineLike/>}</div>
                        </div>
                        <div onClick={saveBlog} className="cursor-pointer">{bookmark ? <MdBookmarks/> :<MdOutlineBookmarks/> }</div>
                </div>
                {/* { isImage &&
                <div className="flex justify-center content-center">
                    <img src={`https://pub-1fab6c2575d44e75bf69e0d8827f0a72.r2.dev/blog-website%2F${blog.id}.png`} className="w-96 h-96 border"/>
                </div>} */}
                <div className="text-lg  " 
                 style={{ 
                    maxWidth: '100%', 
                    wordWrap: 'break-word', 
                    overflowWrap: 'break-word', 
                    whiteSpace: 'pre-wrap',
                    overflow: 'auto',
                    boxSizing: 'border-box'
                  }}
                >{ReactHTMLParser(blog.content)}</div>
                <Comments ></Comments>
                {/* <div className=" md:text-lg lg:text-lg text-sm" dangerouslySetInnerHTML={{__html:blog.content}}/> */}
            </div>

        </>
    )
}
