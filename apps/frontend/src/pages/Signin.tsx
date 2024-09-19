
import { useRecoilState, useSetRecoilState } from "recoil"
import { emailAtom, imageAtom, isAuthenticated, passwordAtom, tokenAtom, userIdAtom, usernameAtom } from "../store/atoms/user"
import {loginParams} from "@repo/types/types"
import { Suspense, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { googleSignIn, userSignIn } from "../service/apiAuthSignin"
import { toast } from "sonner"
import { IoIosEye, IoIosEyeOff } from "react-icons/io"
import {  TokenResponse, useGoogleLogin } from "@react-oauth/google"
import axios from "axios"
import { FaGoogle } from "react-icons/fa"


export default function Signin() {
  const [user,setUser]=useState<Omit<TokenResponse, "error" | "error_description" | "error_uri">>()
  // const [setGProfile]=useState<any>()
  const [,setUserId] = useRecoilState(userIdAtom)
  const [password,setPassword]=useRecoilState(passwordAtom);
  const [email,setEmail]=useRecoilState(emailAtom)
  const setToken=useSetRecoilState(tokenAtom)
  const setUsername=useSetRecoilState(usernameAtom)
  const navigate=useNavigate()
  const setAuth= useSetRecoilState(isAuthenticated)
  const [passwordVisible,setPasswordVisible]=useState(false)
  const [,setGoogleImage]=useRecoilState(imageAtom)


  const login = useGoogleLogin({
    onSuccess: (codeResponse:any) => setUser(codeResponse),
    onError: (error:any) => console.log('Login Failed:', error)
});

useEffect(() => {
  const signInWithGoogle = async () => {
    if (user) {
      let loadingToastId = toast.loading("Signing in...");
      console.log("user cred", user);

      try {
        const res = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            Accept: 'application/json'
          }
        });


        await googleSignIn(setToken, user.access_token, res.data.id, res.data.email, res.data.name, res.data.picture,setUserId);

        toast.dismiss(loadingToastId);
        toast.success("Signed in successfully");

        console.log("response is", res.data);
        setGoogleImage(res.data.picture);
        setUsername(res.data.given_name);
        setAuth(true);
        navigate("/blogs");
      } catch (err) {
        toast.dismiss(loadingToastId);
        toast.error("Something went wrong");
        console.log(err);
      }
    }
  };

  signInWithGoogle();
}, [user]);


  const sendUser=async ()=>{
    const parseUser=loginParams.safeParse({
      email:email,
      password:password,
      
    })
    console.log("parse msg",parseUser.success)
    if(!parseUser.success){
      let refinedMessage = parseUser.error.errors[0]?.message
      refinedMessage=refinedMessage?.replace("String","")
      toast.error(refinedMessage)
      return 
    }
    await userSignIn(email,password,setUsername,setToken,navigate,setAuth,setGoogleImage,setUserId)
  }

//   const logOut = () => {
//     googleLogout();
//     setGProfile(null);
// };
  return (
    <div className="flex max-w-4xl mx-auto my-12 ">
      <div className="flex flex-col w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md md:justify-center md:content-center sm:justify-center sm:content-center">
        <div className="mx-auto max-w-md space-y-4 ">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Welcome back!</h1>
            <p className="text-muted-foreground text-gray-400">Sign in to your account to continue using our blogging platform.</p>
          </div>
          <div>
            <button onClick={() => login()} className="w-full flex justify-center content-center mb-1 border hover:bg-gray-100 rounded-lg p-2">
              <FaGoogle className="h-4 w-4 mr-4 mt-1" />
              <div className=" font-serif font-thin font">Sign in with Google</div>
            </button>
            <div className="flex items-center justify-center w-full py-4">
              <div className="border-t border-gray-300 flex-grow mr-3 "></div>
              <span className="text-gray-400  text-xs  uppercase">Or continue with</span>
              <div className="border-t border-gray-300 flex-grow ml-3"></div>
            </div>
          </div>
          <div className="flex">
            <label className="text-lg font-medium " htmlFor="email">Email</label>
            <input placeholder="john@gmail.com" className="border text-sm border-slate-500 w-2/3  rounded-sm h-8 ml-9 border-blackborder-black focus:border-black pl-3" onChange={(e)=>setEmail(e.target.value)} type="email" id="email"></input>
          </div>
        </div>
       <div>
       <div className="flex 500">
            <label className="font-medium" htmlFor="password">Password</label>
            <div className="flex border-1 border border-slate-500 w-2/3  rounded-sm h-8 ml-3">
                <input
                    onChange={(e)=>setPassword(e.target.value)}
                    type={passwordVisible ? "text" : "password"}
                    className=" border-none focus:outline-none rounded w-full h-7 ml-3 pt-1"
                    placeholder="******"
                />
                <button
                    type="button"
                    className=" inset-y-0  flex items-center "
                    onClick={()=>setPasswordVisible(!passwordVisible)}
                >
                    {passwordVisible ? (
                        <IoIosEyeOff className="h-4 w-4 text-gray-500 mr-2" />
                    ) : (
                        <IoIosEye className="h-4 w-4 text-gray-500 mr-2" />
                    )}
                </button>
            </div>
          </div>
        </div>
        <Suspense fallback={"loading..."}> <button onClick={sendUser} className="w-full bg-black text-white h-10 rounded-lg   hover:m-1 ease-in-out transition delay-100">Sign In</button></Suspense>
        <div className="flex flex-col">
          <a className="text-sm text-black-600 hover:underline" href="/signup">
            Don't have an account? SignUp
          </a>
        </div>  
      </div>
      <div className="hidden ml-12 space-y-4 lg:block w-80">
        <blockquote className="text-lg font-semibold italic text-gray-600">
          “Time moves on regardless of your exertion; the only forfeiture in withholding your best is yourself.”
        </blockquote>
        <div className="space-y-1">
          <div className="text-lg font-semibold">Random</div>
          <div className="text-sm text-gray-500">CEO, CodeSphere</div>
        </div>
      </div>
    </div>
  )
}