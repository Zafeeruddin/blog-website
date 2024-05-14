
import Label from "./ui/label"
import { useRecoilState, useSetRecoilState } from "recoil"
import { emailAtom, passwordAtom, tokenAtom, usernameAtom } from "../store/atoms/user"


import { Suspense, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"


export default function Signin() {

  
  const [password,setPassword]=useRecoilState(passwordAtom);
  const [email,setEmail]=useRecoilState(emailAtom)
  const [message,setMessage]=useState("")
  const setToken=useSetRecoilState(tokenAtom)
  const setUsername=useSetRecoilState(usernameAtom)
  const navigate=useNavigate()

  const sendUser=async ()=>{
    // const parseUser=signupParams.safeParse({
    //   username:username,
    //   email:email,
    //   password:password,
      
    // })
    // console.log("parse msg",parseUser.success)
    // if(!parseUser.success){
    //   console.log("erros",parseUser.error.errors)
    //   setMessage("invalid params")
    //   return 
    // }
    try{
      const signinUser=await axios.post("https://backend.mohammed-xafeer.workers.dev/api/v1/user/signin",{email:email,password:password})
      setMessage(signinUser.data.msg)
      if(!signinUser.data.token){
        return 
      }
      setToken(signinUser.data.token)
      setUsername(signinUser.data.name)
      
      console.log("token set",signinUser.data.token)
      console.log("data ",signinUser.data)
      navigate("/blogs")
    }catch(e){
      return 
    }
    //setInterval(()=>{setMessage("")},3000)
    return 
  }
  return (
    <div className="flex max-w-4xl mx-auto my-12">
      <div className="flex flex-col w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="flex flex-col space-y-1">
          <h1 className="text-4xl font-bold">Create an account</h1>
          <a className="text-sm text-blue-600 hover:underline" href="/signup">
            Don't have an account? SignUp
          </a>
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <input className="border-2 pl-2 border-slate-500 w-48 h-8  ml-11 rounded-md border-blackborder-black focus:border-black" onChange={(e)=>setEmail(e.target.value)} type="email" id="email"></input>
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <input className="border-2 pl-2 border-slate-500 w-48 h-8  ml-4 rounded-md border-blackborder-black focus:border-black" onChange={(e)=>setPassword(e.target.value)} type="password" id="password"></input>
        </div>
        <Suspense fallback={"loading..."}> <button onClick={sendUser} className="w-full bg-black text-white h-10 rounded-lg   hover:m-1 ease-in-out transition delay-100">Sign In</button></Suspense>
        <div>{message}</div>
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