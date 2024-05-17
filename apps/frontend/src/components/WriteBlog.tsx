import axios from "axios";
import { useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { tokenAtom } from "../store/atoms/user";
import { useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";


export const WriteBlog = () => {

  const editorRef=useRef(null);
  const log=()=>{
    if(editorRef.current){
      //@ts-ignorets-ignore
      setContent(editorRef.current.getContent())
      //@ts-ignorets-ignore
      console.log("content: ",editorRef.current.getContent())
      publishBlog()
    }
  }
  // const [onClicking, setOnClick] = useState(false);
  const [msgClick, setmsgClick] = useState(false);
  const closeMessage=()=>{
    setmsgClick(false)
  }

  const navigate=useNavigate()

  const [title,setTitle]=useState("")
  const [content,setContent]=useState("")
  const [message,setMessage]=useState("")
  const token=useRecoilValue(tokenAtom)
  console.log("api",import.meta.env.VITE_API_KEY_TINY)
  const publishBlog=async ()=>{
    console.log("ready")
    setMessage("")
    const headers={
        "Authorization":token
    }
    const response=await axios.post("https://backend.mohammed-xafeer.workers.dev/api/v1/blog",{title:title,content:content},{headers})
    const data=response.data
    setMessage(data.msg)
    console.log(data.error? data.error :"")
    setmsgClick(true)
  }
  return (
    <>
    <div className="flex items-center justify-between p-4 space-x-2 border-b border-gray-300 lg:justify-between">
        
        <div className="flex items-center">
            <img onClick={()=>navigate("/blogs")} className="w-12" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5A60gUrqhUV6go5-qfph4kwQ-pfV4Ip5Ngw&s" alt="Logo" />
        </div>
    
        
        <div className="ml-4 flex items-center justify-end space-x-4">       
            <button onClick={log} className=" p-2 bg-green-700 rounded-3xl text-center text-white font-mono hover:bg-green-900">publish</button>
           
            <div className="relative pt-2 hidden sm:block md:block">
                <button className="text-white ">
                    <img className="w-10" src="https://icons.veryicon.com/png/o/object/material-design-icons/notifications-1.png" alt="Notifications"/>
                </button>
                <span className="bg-red-500   text-white rounded-full w-4 h-4 flex items-center justify-center absolute top-0 right-0 mt-1 mr-">3</span>
            </div>   

            <div className="flex items-center space-x-1">
                <div className="bg-gray-800 text-white rounded-full h-10 w-10 flex items-center justify-center">
                    <span className="uppercase">U</span>
                </div>
                <button className="text-white">Profile</button>
            </div>
        </div>

    </div>
 
<div  id="alert-border-3" className={`${msgClick ? "" :"hidden"}   flex items-center p-4 mb-4 text-green-800 border-t-4 border-green-300 bg-green-50 dark:text-green-400 dark:bg-gray-800 dark:border-green-800`} role="alert">
    <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
    </svg>
    <div className="ms-3 text-sm font-medium">
      {message}
    </div>
    <button onClick={closeMessage} type="button" className="ms-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700"  data-dismiss-target="#alert-border-3" aria-label="Close">
      <span className="sr-only">Dismiss</span>
      <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
      </svg>
    </button>
</div>

<div className={`lg:p-20  lg:pl-40 lg:pr-40 border   p-1 h-screen `}>
  <div className="p-1 border-solid border-gray-500  text-2xl lg:text-4xl font-sans font-bold ">
    <textarea
      onChange={(e)=>setTitle(e.target.value)}
      placeholder="Tell Your Story..."
      className="border  resize-none  focus:outline-none focus:border-transparent focus:ring-0 focus:ring-transparent px-4 py-2 h-full w-full "
    />
  </div>
  
  <div className="p-1 h-full">
    
    
    {/* @ts-ignore */}
    <Editor apiKey={import.meta.env.VITE_API_KEY_TINY} onInit={(_evt, editor) => editorRef.current = editor}
    initialValue="<p>This is the initial value..</p>"
    init={{
      height:500,
      menubar:false,
      plugins:['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
],
toolbar:'undo redo | blocks | ' +
'bold italic forecolor | alignleft aligncenter ' +
'alignright alignjustify | bullist numlist outdent indent | ' +
'removeformat | help',
content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
    
    }}
    />
  </div>
</div>

    
    </>
  );
};
