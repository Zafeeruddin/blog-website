import { useEffect, useRef, useState } from "react"
import {  FaSignOutAlt } from "react-icons/fa"
import { IoMdNotifications } from "react-icons/io"
import { IoBookmarks } from "react-icons/io5"
import { TfiWrite } from "react-icons/tfi"
import { RiMediumFill } from "react-icons/ri";
import { Outlet, useNavigate } from "react-router-dom"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { getNotification } from "../../service/apiGetNotifications"
import { areNotifications, imageAtom, isAuthenticated, isSearch, notifiationCount, notifications, searchBlog, unifiedNotificationsAtom, usernameAtom } from "../../store/atoms/user"
import { NotificationCard, transformNotification } from "../Notification"
import { handleNotificationAtom, handleProfileAtom } from "../../store/atoms/handles"
import { userSignOut } from "../../service/apiAuthSignin"
import Noty from "./NotyIcon"
import { GetProfile } from "../user/getProfile"

export const Layout=()=>{
    const navigate=useNavigate()
    const [handleProfile,setHandleProfile]=useRecoilState(handleProfileAtom)
    const [handleNotification,setHandleNotification]=useRecoilState(handleNotificationAtom)
    const username=useRecoilValue(usernameAtom)
    // const [token]=useRecoilState(tokenAtom)
    const [userNotifications,setUserNotifications ]=useRecoilState(notifications)
    // const [handleUpdate,setHandleUpdate]=useState(false)
    const [,setUnifiedNotification] = useRecoilState(unifiedNotificationsAtom)
    const setNotificationCount = useSetRecoilState(notifiationCount)
    const [loading,setLoading]=useState(true)
    const [searchBlogs,setSearchBlog] = useRecoilState(searchBlog)
    const [areNotificationsIn,setAreNotifications] = useRecoilState(areNotifications)
    const [,setIsSearch]=useRecoilState(isSearch)
    const setUserAuth = useSetRecoilState(isAuthenticated)
    const [prevScrollPos, setPrevScrollPos] = useState(0);
	const [visible, setVisible] = useState(true);
	const [scrollingDown, setScrollingDown] = useState(false);
    const ref = useRef<HTMLDivElement>(null)
    const [googleImage,]=useRecoilState(imageAtom)


    const debounce = (func: any, delay: any) => {
		let timeoutId: any;
		return (...args: any) => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				func(...args);
			}, delay);
		};
	};

    // scroll layout
    const debouncedHandleScroll = debounce(() => {
		const currentScrollPos = window.scrollY;
		setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 50);
		setScrollingDown(prevScrollPos < currentScrollPos);
		setPrevScrollPos(currentScrollPos);
	}, 80);

	useEffect(() => {
		window.addEventListener('scroll', debouncedHandleScroll);
		return () => {
			window.removeEventListener('scroll', debouncedHandleScroll);
		};
	}, [prevScrollPos, debouncedHandleScroll]);


        // Fetch notifications
    useEffect(()=>{
        const getNotifications=async ()=>{
            await  getNotification(setUserNotifications,setAreNotifications)
            if(areNotificationsIn){
                transformNotification(userNotifications,setUnifiedNotification,setNotificationCount)
            }
            setLoading(false)
        }
        getNotifications()
    },[])

    // change to search blog
    useEffect(()=>{
        if(searchBlogs===""){
            setIsSearch(false)
        }else{
            setIsSearch(true)
            navigate("/search")
        }  
    },[searchBlogs])

    const clickProfile=()=>{
        if(handleNotification && !handleProfile){
            setHandleNotification(false)
        }
        setHandleProfile(!handleProfile)
    }

    const signUserOut =()=>{
        userSignOut(setUserAuth)
        navigate("/signin")
    }

    const clickNotification=()=>{
        if(handleProfile && !handleNotification){
            setHandleProfile(false)
        }
        setHandleNotification(!handleNotification); 
    }

    return (
        <>
    <div ref={ref} className={`flex items-center justify-between p-4 space-x-2 border-b  border-gray-300 lg:justify-between 
        sticky top-0 z-50 transition-transform duration-300 bg-white ${
            !visible && scrollingDown ? 'transform -translate-y-full ' : ' '
        }  `}>
        
        <div className="flex items-center">
            {/* <img className="w-12 cursor-pointer" onClick={()=>navigate("/blogs")}  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5A60gUrqhUV6go5-qfph4kwQ-pfV4Ip5Ngw&s" alt="Logo" /> */}
            {/* <img className="w-12 cursor-pointer" onClick={()=>navigate("/blogs")}  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4xsxis-a7S4ExWfMQ3fQd4_dv230UjtY5bA&s" alt="Logo" /> */}
            <RiMediumFill className="w-12 h-12 cursor-pointer"  onClick={()=>navigate("/blogs")}/>

        </div>
    

        <form className="max-w-lg sm:w-40 lg:w-full sm:-space-x-2 md:-space-x-3 ">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                </div>
                <input onChange={(e)=>{setSearchBlog(e.target.value)}}  type="search" id="default-search" className="block w-full py-2 pl-10 pr-3 text-sm text-gray-900 border border-gray-300 rounded-3xl focus:ring-blue-500 focus:border-blue-500" placeholder="Search Mockups, Logos..." required />
            </div>
        </form>
               
        <div className="flex justify-end lg:space-x-8 space-x-4">   
        <TfiWrite className={`w-5 h-5 lg:w-7 lg:h-7 text-gray-400 mt-2 cursor-pointer hover:text-gray-800`} onClick={()=>navigate("/write")}></TfiWrite>
        
        <div className="cursor-pointer mt-1 " onClick={clickNotification}>
            { handleNotification ?
                // <Noty width={300} color={"#ffff00"} count={10}/>:
                <IoMdNotifications className={`w-7 h-7 text-gray-400 bg-white lg:w-10 lg:h-10 hover:text-gray-800`}/> :   
                <Noty width={30} color={"#a1a1aa"}/>
                // <IoMdNotificationsOutline className={`w-7 h-7 text-gray-400 bg-white lg:w-10 lg:h-10 hover:text-gray-800`}/>
            }
        { handleNotification && !loading && 
            <div className={`shadow-2xl rounded-lg p-1 w-2/3 lg:w-1/3 md:w-1/2   ${areNotificationsIn ? " h-80" :" h-20 w-80 flex justify-center content-center" }   overflow-auto  right-4  absolute top-16 bg-gray-200`}> 
                    { !areNotificationsIn ? <div className="m-2 p-2 text-lg font-semibold font-sans">You don't have notifications</div> :
                     <NotificationCard  notification={userNotifications}/>
                    }   
            </div> }
        </div>

        <div onClick={clickProfile} className=" mt-1 items-center space-x-1 relative z-50 cursor-pointer">
            <div className="bg-gray-800 text-white rounded-full h-8 w-8 lg:w-10 lg:h-10  flex items-center justify-center">
                <GetProfile gProfile={googleImage} username={username}/>
            </div>

            {handleProfile && 
            <div className="border text-gray-500 shadow-2xl p-6 mt-1 rounded-lg w-48 absolute right-1  top-12 bg-white cursor-pointer">
                <div onClick={()=>navigate("/filteredBlogs")} className="hover:text-slate-950  rounded-lg border-b pb-2 mb-1 p-2 pl-3 flex" >
                    <IoBookmarks className="mt-1 mr-3 " />
                    <div>Saved Blogs</div>
                </div>
                <div onClick={()=>navigate("/myblogs")} className="hover:text-slate-950  rounded-lg border-b pb-2 mb-1 p-2 pl-3 flex">
                    <RiMediumFill className="mt-1 mr-2 w-5 h-5"/>
                    <div>My Blogs</div>
                </div>
                <div onClick={signUserOut} className=" rounded-lg p-2 pl-3 flex hover:text-slate-950 cursor-pointer">
                    <FaSignOutAlt  className="mt-1 mr-3"/>
                    <div>Sign Out</div>
                </div>
                
            </div>}

        </div>
        </div>
    </div>
<Outlet/>
    
   
        </>
    )
}


