import axios from "axios";
import {    useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { tokenAtom } from "../store/atoms/user";
import {useNavigate} from "react-router-dom";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { formats, modules } from "../utils/editor";
import { toast } from "sonner";
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css'; // Import a Highlight.js style
import { getImage, putImage } from "../service/apiPutImage";
import { ClipLoader } from "react-spinners";

hljs.configure({
  languages: ['javascript', 'python', 'java', 'cpp', 'csharp', 'ruby', 'go', 'php', 'html', 'css', 'json'] // Add languages you want to support
});


export const Write = () => {
  const navigate=useNavigate()
  const [title,setTitle]=useState("")
  const [content,setContent]=useState("")
  const token=useRecoilValue(tokenAtom)
  const refTitle= useRef<HTMLTextAreaElement>(null)
  const quillRef = useRef<ReactQuill>(null);
  const [file,setFile ]= useState<undefined | File>()
  const [url,setUrl] = useState<string>("")
  const [loading ,setLoading] = useState(false)

  const handleFileChange = (e:any)=>{
    const file = e.target.files[0];
    if (file) {
        setFile(file);
        console.log("set file an image")
    }
  }
  
  const publishBlog=async ()=>{
    setLoading(true)
    const headers={
        "Authorization":token
    }
    try{
      const response=await axios.post(`${import.meta.env.VITE_BACKEND_PROD_URL}/api/v1/blog/post`,{title:title,content:content},{withCredentials:true,headers})
      const data=response.data
      console.log(data.error? data.error :"")
      console.log("data",data.status)
      console.log("data",data)

      if(response.status===200){
        console.log("data",data)
        toast.success("Blog Posted!")
        console.log("url is ", data.url)
        refTitle.current?.value==""
        if(data.blogId && file){
          await putImage(data.blogId,file)
          const url = await getImage(response.data.blogId)
          console.log("url is ",url)
          if(url){
            setUrl(url)
          }
          // navigate(`/${data.blogId}`)
        }
      }
    
    }catch(E){
      console.log(E)
      toast.error("Error publishing the blog")
    }
    setLoading(false)
  }
  return (
    <>
    <div className="flex items-center justify-between p-4 space-x-2 border-b border-gray-300 lg:justify-between">  
        <div className="flex items-center">
            <img onClick={()=>navigate("/blogs")} className="w-12" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5A60gUrqhUV6go5-qfph4kwQ-pfV4Ip5Ngw&s" alt="Logo" />
        </div>
    
        
        <div className="ml-4 flex items-center justify-end space-x-4"> 
            <ClipLoader loading={loading} size={25}></ClipLoader>      
             {
                !loading ? 
                <button onClick={publishBlog} className=" p-2 bg-green-700 rounded-3xl text-center text-white font-mono hover:bg-green-900">publish</button>  
                : <div></div>
              }
            <div className="flex items-center space-x-1">
                <div className="bg-gray-800 text-white rounded-full h-10 w-10 flex items-center justify-center">
                    <span className="uppercase">U</span>
                </div>
            </div>
        </div>

    </div>
 
    <div className="lg:px-40 lg:py-20 p-4 h-screen border border-gray-300 bg-white shadow-lg rounded-lg">
  <div className="mb-6">
    <textarea
      ref={refTitle}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="Tell Your Story..."
      className="w-full text-3xl lg:text-5xl font-sans font-bold border-b border-gray-300 py-4 px-2 focus:outline-none focus:ring-0 resize-none"
    />
  </div>

  <div className="mb-4">
    <input 
      type="file" 
      name="file" 
      onChange={handleFileChange} 
      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
    />
  </div>

  {url && (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Blog Thumbnail</h3>
      <div className="border border-gray-300 p-4 rounded-lg shadow-sm bg-gray-50">
        <img src={url} alt="Thumbnail Preview" className="w-full h-auto rounded-md object-cover" />
      </div>
    </div>
  )}

  <div className="mb-6">
    <ReactQuill
      ref={quillRef}
      onChange={(content) => { setContent(content); console.log(content); }}
      theme="snow"
      modules={modules}
      formats={formats}
      placeholder="Write Your Content"
      className="h-64"
    />
  </div>
</div>
   
</>
  );
};
