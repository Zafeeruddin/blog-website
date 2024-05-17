import { useEffect, useState } from "react"
import { FaSignOutAlt } from "react-icons/fa"
import { IoMdNotificationsOutline } from "react-icons/io"
import { IoBookmarks } from "react-icons/io5"
import { TfiWrite } from "react-icons/tfi"
import { useNavigate } from "react-router-dom"
import { useRecoilState, useRecoilValue } from "recoil"
import { getNotification } from "../../service/apiGetNotifications"
import { notifications, tokenAtom, usernameAtom } from "../../store/atoms/user"
import { NotificationCard } from "../Notification"
import { updateNotification } from "../../service/apiUpdateNotifications"

export const Layout=()=>{
    const navigate=useNavigate()
    const [handleProfile,setHandleProfile]=useState(false)
    const [handleNotification,setHandleNotification]=useState(false)
    const username=useRecoilValue(usernameAtom)
    const token=useRecoilValue(tokenAtom)
    const [userNotifications,setUserNotifications ]=useRecoilState(notifications)
    const [handleUpdate,setHandleUpdate]=useState(false)
    useEffect(()=>{
        getNotification(token,setUserNotifications)
        console.log("notitficaiton now",userNotifications)
    },[])

    const updateNotifications=()=>{
        
        if(!handleUpdate){
            console.log("in the notifications",handleUpdate)
            setHandleUpdate(true)
            console.log("setting notificaiton to be true",handleNotification)
        }
        if(handleUpdate){
            updateNotification(token)
        }
    }

    // useEffect(()=>{
    //     const notify=async ()=>{
    //         console.log("token given out",token)
    //         const headers={
    //             "Authorization":token,
    //         }
    //         const response=await axios.put("https://backend.mohammed-xafeer.workers.dev/api/v1/blog/post/comments",{headers})
    //         setNotifications(response.data)
    //     }
    //     setUserNotifications([...notification])
    //     notify()
    // },[handleNotification])
    
    
    
    

    return (
        <>
    <div className={`flex items-center justify-between p-4 space-x-2 border-b  border-gray-300 lg:justify-between `}>
        
        <div className="flex items-center">
            <img className="w-12 cursor-pointer" onClick={()=>navigate("/blogs")}  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5A60gUrqhUV6go5-qfph4kwQ-pfV4Ip5Ngw&s" alt="Logo" />
        </div>
    

        <form className="max-w-lg sm:w-40 lg:w-full sm:-space-x-2 md:-space-x-3 ">
            <label  className="sr-only">Search</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                </div>
                <input  type="search" id="default-search" className="block w-full py-2 pl-10 pr-3 text-sm text-gray-900 border border-gray-300 rounded-3xl focus:ring-blue-500 focus:border-blue-500" placeholder="Search Mockups, Logos..." required />
            </div>
        </form>

        
               
        <div className="flex justify-end lg:space-x-8 space-x-4">   
        <TfiWrite className={`w-5 h-5 lg:w-7 lg:h-7 text-gray-500 mt-2 `} onClick={()=>navigate("/write")}></TfiWrite>
        
        <div className="cursor-pointer mt-1" onClick={()=>{setHandleNotification(!handleNotification); updateNotifications()}}>
            <IoMdNotificationsOutline className={`w-7 h-7 text-gray-500 bg-white lg:w-10 lg:h-10`}/>
        { handleNotification &&    
            <div className="shadow-2xl rounded-lg p-1 w-2/3 lg:w-1/3 min-h-10  max-h-screen/2 overflow-auto  right-4  absolute top-16 bg-gray-200">
                 
                    {/* <div className="p-2 mb-3  font-serif text-gray-500 border-b border-gray-300"> You don't have notifications </div> */}
                     <NotificationCard notification={userNotifications}/>
                
            </div> }
        </div>

        <div onClick={()=>setHandleProfile(!handleProfile)} className=" mt-1 items-center space-x-1 relative z-50">
            <div className="bg-gray-800 text-white rounded-full h-8 w-8 lg:w-10 lg:h-10  flex items-center justify-center">
                <span className="uppercase">{username[0]}</span>
            </div>

            {handleProfile && 
            <div className="border text-gray-500 shadow-2xl p-6 mt-1 rounded-lg w-48 absolute right-1  top-12 bg-white cursor-pointer">
                <div className="hover:text-slate-950  rounded-lg border-b pb-2 mb-1 p-2 pl-3 flex" >
                    <IoBookmarks className="mt-1 mr-3 " />
                    <div>Saved Blogs</div>
                </div>
                <div className=" rounded-lg p-2 pl-3 flex hover:text-slate-950 cursor-pointer">
                    <FaSignOutAlt  className="mt-1 mr-3"/>
                    <div>Sign Out</div>
                </div>
            </div>}

        </div>
        </div>

    </div>

    
   
        </>
    )
}


