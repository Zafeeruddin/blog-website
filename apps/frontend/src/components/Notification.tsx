import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { formatDate } from "../utils/formatDate"
import { useNavigate } from "react-router-dom"
import { Notification, UnifiedNotification } from "../utils/types"

export const NotificationCard=({notification}:{notification:Notification})=>{
    const [unifiedNotification,setUnifiedNotification]=useState<UnifiedNotification[]>([])
    useEffect(()=>{
        transformNotification(notification,setUnifiedNotification)
    },[])
    
    

    return (
        <>
            {
                unifiedNotification.map(notification=>{
                    return < NotificationBar content={notification.content} postId={notification.postId} user={notification.user} date={notification.date}
                    isComment={notification.isComment} flagNotified={notification.flagNotified}/>        
            })
            }
        </>
    )
}


const NotificationBar=({content,postId,user,date,isComment,flagNotified}:{content:string,postId:string,user:string,date:Date,isComment:boolean,flagNotified:boolean})=>{
    const [duration,setDuration]=useState("")
    useEffect(()=>{
        formatDate(date,setDuration)
    },[])
    const navigate=useNavigate()
    return (
        <>
        <div onClick={()=>navigate(`/blogs/${postId}`)} className={`flex justify-start space-x-4 cursor-pointer text-md font-serif border-b  border-gray-400 p-4  ${flagNotified ? "bg-gray-200" :"bg-gray-300"}`}>
            {flagNotified===false ?  <div className="rounded-full bg-blue-600 min-h-2 max-h-2 min-w-2 max-w-2 mt-5"></div> :""}
            <div className="rounded-full bg-orange-700 min-h-8  max-h-8 min-w-8  max-w-8 mt-2  text-white text-center text-lg">{user[0]}</div>
            <div className="">
                <div className="flex ">{user.charAt(0).toUpperCase() + user.slice(1)} {isComment ? "Replied" : "Commented"}: {content}</div>
                <div className="text-gray-400 text-sm">{duration} ago</div>
            </div>
        </div>
        </>
    )
}


const transformNotification = (notification: Notification,setUnifiedNotification:Dispatch<SetStateAction<UnifiedNotification[]>>) => {
    const transformedContent: UnifiedNotification[] = [];

    // Transform comments
    for (const comment of notification.comments) {
        transformedContent.push({
            content: comment.comment,
            user: comment.user,
            postId: comment.postId,
            isComment: true,
            date: comment.date,
            flagNotified:comment.flagNotified
        });
    }

    
    // Transform replies
    for (const reply of notification.replies) {
        transformedContent.push({
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

    setUnifiedNotification([...transformedContent]);
};
