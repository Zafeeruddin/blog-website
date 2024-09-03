import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {  useRecoilState } from 'recoil';
import { isAuthenticated } from '../store/atoms/user';
import axios from 'axios';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const [isAuth,setIsAuth]= useRecoilState(isAuthenticated)
	// const { user, isLoading } = useUser();
	const navigate = useNavigate();
    console.log("isAuth",isAuth)

    const getUserSession = async ()=>{
        // const response=await axios.get("https://backend.mohammed-xafeer.workers.dev/api/v1/blog",{withCredentials:true})
        // if(response.status===401){
            // setIsAuth(false)
            navigate("/signin")
            return
        // }
        // setIsAuth(true)
        // return
    }

    useEffect(()=>{
        if(isAuth){
            return
        }
        if(!isAuth){
            getUserSession();
            return 
        }
    
    },[])
    console.log("reach here as well")
    return children
	
}