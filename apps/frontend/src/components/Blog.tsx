import axios from "axios"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { savedBlogs, tokenAtom } from "../store/atoms/user"
import { useNavigate } from "react-router-dom"
import { blogOpen } from "../store/atoms/post"
import parse from "html-react-parser"
import { useEffect, useState } from "react"
import { MdBookmarkAdd } from "react-icons/md"
import { blogType } from "../utils/types"
import { openBlog } from "../service/apiFetchBlog"
import { getImage } from "../service/apiPutImage"


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
    const [isImage,setIsImage]=useState(false)
    const [imageUrl,setImageUrl] = useState<string | null>(null)

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

    // // check for image
    // const imageUrl = `https://pub-1fab6c2575d44e75bf69e0d8827f0a72.r2.dev/blog-website%2F${blog.id}.png`;

    useEffect(() => {
        const checkImage = async () => {
        try {
            const url = await getImage(blog.id);
            console.log("url of image",url)
            if (url){
                setImageUrl(url)
                setIsImage(true)
            }else{
                setIsImage(true)
            }
        } catch (error) {
            setIsImage(false);
        }
        };

        checkImage();
    }, []);
    
    
    useEffect(()=>{
        const newDate=new Date(blog.date)
        const year= newDate.getFullYear()
        const date=newDate.getDate()
        const month= newDate.toDateString().substring(4,7)
        setDate(`${month} ${date}, ${year}`)
    },[])


    const fetchBlog=async ()=>{
        // Used for both navigating blogs and comments from notification
        openBlog(blog.id,setOpenBlog,navigate,false,"")
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
                        <div className="pb-3 font-bold  text-sm text-black lg:text-xl cursor-pointer" onClick={fetchBlog}>{blog.title}</div>
                        <p className="text-sm lg:text-lg text-gray-400"> {parse(blog.content.substring(0,150))}...</p>
                        <div className="flex space-x-8">
                            <div className="text-gray-400 text-sm">{Math.floor(duration) == 0 ? 1 : Math.floor(duration)} mins read</div>
                            <MdBookmarkAdd onClick={saveBlog}  className="mt-1 w-4 h-4 cursor-pointer"/>
                        </div>
                    </div>
                    {isImage && imageUrl &&
                        <div className="w-1/4 mt-2 ml-10 ">
                            <img src={imageUrl} className=" h-20 w-20"/>
                        </div>
                    }
                </div>
            </div>               
        </>
    )
}