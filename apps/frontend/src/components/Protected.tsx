import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {  useRecoilValue } from 'recoil';
import { isAuthenticated } from '../store/atoms/user';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const isAuth= useRecoilValue(isAuthenticated)
	// const { user, isLoading } = useUser();
	const navigate = useNavigate();
    console.log("isAuth",isAuth)
    useEffect(()=>{
        if(!isAuth){
            console.log("user not authenticated",isAuth)
            navigate("/signin")
            return 
        }
    
    },[])
    console.log("reach here as well")
    return children
	
}