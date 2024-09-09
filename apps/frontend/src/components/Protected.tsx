import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {  useRecoilState } from 'recoil';
import { isAuthenticated } from '../store/atoms/user';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const [isAuth,]= useRecoilState(isAuthenticated)
	// const { user, isLoading } = useUser();
	const navigate = useNavigate();
    console.log("isAuth",isAuth)

    const getUserSession = async ()=>{
            navigate("/signin")
            return
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