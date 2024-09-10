
import Label from "../components/ui/label.js"
import { useRecoilState } from "recoil"
import { emailAtom,  passwordAtom, usernameAtom } from "../store/atoms/user.js"

import { useNavigate } from "react-router-dom"
import { signupParams } from "@repo/types/types"
import { toast } from "sonner"
import { sendOtp } from "../service/apiSendOtp.js"
import { useState } from "react"
import { verifyEmail } from "../service/apiVerifyEmial.js"


export default function Signup() {
  const [username,setUsername]=useRecoilState(usernameAtom)
  const [password,setPassword]=useRecoilState(passwordAtom);
  const [email,setEmail]=useRecoilState(emailAtom)
  const navigate=useNavigate()
  const [success,]= useState(false)

  
  const sendUser=async ()=>{
    console.log("sigining up" ,email)
    let isOTP;
    const parseUser=signupParams.safeParse({
      username:username,
      email:email,
      password:password,
      
    })
    if(!parseUser.success){
      console.log("unscuc")
      console.log("erros",parseUser.error.errors)
      let refinedMessage = parseUser.error.errors[0]
      let message = refinedMessage?.message.replace("String","")
      let param = refinedMessage?.path[0] as string
      if(param=="email"){
        console.log("param is ")
        toast.error( message )
      }else{
        toast.error(param + message )
      }
      return 
  }else if(parseUser.success){
    let loadingToastId = toast.loading("Checking email...")
    const proceed =await verifyEmail(email)
    console.log("proceed is ",proceed)
    if(proceed===true){
      console.log("proeceeding ")
      toast.dismiss(loadingToastId)
      isOTP= await sendOtp(email)
    }else{
      toast.dismiss(loadingToastId)
      toast.error("Email already signed up")
      return
    }
  }
  console.log("success is ",success)
    if(isOTP){
      navigate("/otp")
      return
    }else{
      toast.error("Something went wrong")
      return
    }
    //setInterval(()=>{setMessage("")},3000)     
  }
  return (
    <div className="flex max-w-4xl mx-auto my-12">
      <div className="flex flex-col w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="flex flex-col space-y-1">
          <h1 className="text-4xl font-bold">Create an account</h1>
          <a className="text-sm text-blue-600 hover:underline" href="/signin">
            Already have an account? Login
          </a>
        </div>
        <div className="">
          <Label htmlFor="username">Username</Label>
          <input className="border-2 pl-2 border-slate-500 w-48 h-8  ml-4 rounded-md border-blackborder-black focus:border-black" onChange={(e)=>setUsername(e.target.value)} type="text" id="password"></input>
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <input className="border-2 pl-2 border-slate-500 w-48 h-8  ml-12 rounded-md border-blackborder-black focus:border-black" onChange={(e)=>setEmail(e.target.value)} type="email" id="email"></input>
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <input className="border-2 pl-2 border-slate-500 w-48 h-8  ml-5 rounded-md border-blackborder-black focus:border-black" onChange={(e)=>setPassword(e.target.value)} type="password" id="password"></input>
        </div>
        <button onClick={sendUser} className="w-full bg-black text-white h-10 rounded-lg   hover:m-1 ease-in-out transition delay-100">Sign Up</button>
      </div>
      <div className="hidden ml-12 space-y-4 lg:block w-80">
        <blockquote className="text-lg font-semibold italic text-gray-600">
          “The customer service I received was exceptional. The support team went above and beyond to address my
          concerns.”
        </blockquote>
        <div className="space-y-1">
          <div className="text-lg font-semibold">Jules Winnfield</div>
          <div className="text-sm text-gray-500">CEO, Acme Inc</div>
        </div>
      </div>
    </div>
  )
}