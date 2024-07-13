import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { formatDate } from "../utils/formatDate"
import { useNavigate } from "react-router-dom"
import { Notification, UnifiedNotification } from "../utils/types"
import {  unifiedNotificationsAtom } from "../store/atoms/user"
import { useRecoilState, useSetRecoilState } from "recoil"
import { openBlog } from "../service/apiFetchBlog"
import { blogOpen } from "../store/atoms/post"

export const NotificationCard=({notification}:{notification:Notification})=>{
    const [unifiedNotification,setUnifiedNotification]=useRecoilState<UnifiedNotification[]>(unifiedNotificationsAtom)
    

    useEffect(()=>{
        console.log("notifications are ",notification)
        console.log("unified notifications are",unifiedNotification)
        if (notification.replies.length!=0 || notification.replies.length!=0){
            console.log("ready to unite")
            transformNotification(notification,setUnifiedNotification)
        }
    },[])

    
    
    

    return (
        <div className="">
            {unifiedNotification.map(notification=>{
                    return < NotificationBar key={notification.id} content={notification.content} postId={notification.postId} user={notification.user} date={notification.date}
                    isComment={notification.isComment} flagNotified={notification.flagNotified} commentId={notification.id}/>        
            })}
            
        </div>
    )
}


const NotificationBar=({content,postId,user,date,isComment,flagNotified,commentId}:{content:string,postId:string,user:string,date:Date,isComment:boolean,flagNotified:boolean,commentId:string})=>{
    const [duration,setDuration]=useState("")
    const setOpenBlog = useSetRecoilState(blogOpen) 
    useEffect(()=>{
        formatDate(date,setDuration)
    },[])

    const fetchBlog=async ()=>{
        console.log("post id",postId)
        openBlog(postId,setOpenBlog,navigate,true,commentId)
    }
    const navigate=useNavigate()
    return (
        <>
        <div onClick={fetchBlog} className={`flex justify-start space-x-4 cursor-pointer text-md font-serif border-b  border-gray-400 p-4 hover:bg-gray-300  ${flagNotified ? "bg-gray-200" :"bg-gray-300"}`}>
            {flagNotified===false ?  <div className="rounded-full bg-blue-600 min-h-2 max-h-2 min-w-2 max-w-2 mt-5"></div> :""}
            <div className="rounded-full bg-orange-700 min-h-8  max-h-8 min-w-8  max-w-8 mt-2  text-white text-center text-lg">{user[0]}</div>
            <div className="">
                <div className="flex ">{user.charAt(0).toUpperCase() + user.slice(1)} {isComment ?  "Commented" : "Replied"}: {content}</div>
                <div className="text-gray-400 text-sm">{duration} ago</div>
            </div>
        </div>
        </>
    )
}


const transformNotification = (notification: Notification,setUnifiedNotification:Dispatch<SetStateAction<UnifiedNotification[]>>) => {
    const transformedContent: UnifiedNotification[] = [];
    console.log("notifiacation inside transform",notification)
    // Transform comments
    if(notification.comments){
    for (const comment of notification.comments) {
        console.log("inside unified id of post",comment.postId)

        transformedContent.push({
            id:comment.id,
            content: comment.comment,
            user: comment.user,
            postId: comment.postId,
            isComment: true,
            date: comment.date,
            flagNotified:comment.flagNotified
        });
    }
}

    
    // Transform replies
    for (const reply of notification.replies) {
        console.log("inside reply of post",reply.postId)

        transformedContent.push({
            id:reply.id,
            content: reply.reply,
            user: reply.user,
            postId: reply.postId,
            isComment: false,
            date: reply.date,
            flagNotified:reply.flagNotified
        });
    }

    // Sort transformed content by date
    transformedContent.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    console.log("final ",transformedContent)
    transformedContent.reverse()
    setUnifiedNotification([...transformedContent]);
};
