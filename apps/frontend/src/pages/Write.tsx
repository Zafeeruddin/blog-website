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
  const fileRef = useRef<any>(null)
  const formRef = useRef<any>(null)
  const [formData,setFormData]=useState<FormData>()

  
  const publishBlog=async ()=>{
    const headers={
        "Authorization":token
    }
    if(!formData){
      console.log("emoty")
      return
    }
    try{
    formData.append("title",title)
    formData.append("content",content)
    // {title:title,content:content,form:formData}
    console.log("form data is ",formData)
    // https://backend.mohammed-xafeer.workers.dev
    const response=await axios.post("https://backend.mohammed-xafeer.workers.dev/api/v1/blog/post",formData,{headers})
    const data=response.data
    console.log(data.error? data.error :"")
    if(data.msg==="blog posted"){
      toast.success("Blog Posted!")
      console.log("url is ", data.url)
      refTitle.current?.value==""
    }
  }catch(E){
    console.log(E)
  }
    
  }
  return (
    <>
    <div className="flex items-center justify-between p-4 space-x-2 border-b border-gray-300 lg:justify-between">
        
        <div className="flex items-center">
            <img onClick={()=>navigate("/blogs")} className="w-12" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5A60gUrqhUV6go5-qfph4kwQ-pfV4Ip5Ngw&s" alt="Logo" />
        </div>
    
        
        <div className="ml-4 flex items-center justify-end space-x-4">       
            <button onClick={publishBlog} className=" p-2 bg-green-700 rounded-3xl text-center text-white font-mono hover:bg-green-900">publish</button>  

            <div className="flex items-center space-x-1">
                <div className="bg-gray-800 text-white rounded-full h-10 w-10 flex items-center justify-center">
                    <span className="uppercase">U</span>
                </div>
            </div>
        </div>

    </div>
 

<div className={`lg:p-20  lg:pl-40 lg:pr-40 border   p-1 h-screen `}>
  <div className="p-1 border-solid border-gray-500  text-2xl lg:text-4xl font-sans font-bold ">
    <textarea
      ref={refTitle}
      onChange={(e)=>{setTitle(e.target.value); }}
      placeholder="Tell Your Story..."
      className="border  resize-none  focus:outline-none focus:border-transparent focus:ring-0 focus:ring-transparent px-4 py-2 h-full w-full "
    />
  </div>

  {/* Upload Images */}
  <form
  ref={formRef}
  onSubmit={async(e)=>{
    e.preventDefault()
    console.log("ready to take on file")
    const formIn = formRef.current
    const fileInput = formIn?.elements["file"] as HTMLInputElement; // Access file input correctly

    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        console.error("No file selected.");
        return;
    }

    const file = fileInput.files[0]; 
    fileRef.current=file
    const formDataIn = new FormData();
    console.log("file",file)
    if (file instanceof File){
    formDataIn.append("file",file)
    formDataIn.append("hell","anksjdf")
    }
    setFormData(formDataIn)
    console.log("data to be send",JSON.stringify(formDataIn))
  }}>

    <input ref={fileRef} type="file" name="file"></input>
    <button>submit</button>
  </form>
  

  <div className="p-1 h-full">
    <div className=' justify-center w-full '>
          <ReactQuill
            ref={quillRef}
            onChange={(content)=>{setContent(content);console.log(content);}}
            theme='snow'
            modules={modules}
            formats={formats}
            placeholder='Write Your Content'
            className='h-56'
            />
        </div>
  </div>
</div>   
</>
  );
};
