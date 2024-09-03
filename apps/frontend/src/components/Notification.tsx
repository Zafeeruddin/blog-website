import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { formatDate } from "../utils/formatDate"
import { useNavigate } from "react-router-dom"
import {  Notification, UnifiedNotification } from "../utils/types"
import {  areNotifications, notifiationCount, notifications, tokenAtom, unifiedNotificationsAtom } from "../store/atoms/user"
import { SetterOrUpdater, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { openBlog } from "../service/apiFetchBlog"
import { blogOpen } from "../store/atoms/post"
import { handleComment,handleReply } from "../utils/addResponse"
import { updateNotification } from "../service/apiUpdateNotifications"

export const NotificationCard=({notification}:{notification:Notification})=>{
    const [unifiedNotification,setUnifiedNotification]=useRecoilState<UnifiedNotification[]>(unifiedNotificationsAtom)
    const token = useRecoilValue(tokenAtom)
    const setUserNotifcations= useSetRecoilState(notifications)
    const setNotificationCount= useSetRecoilState(notifiationCount)
    // create a ws connection
    useEffect(()=>{
        console.log("reday to connect")
        const ws = new WebSocket('wss://backend.mohammed-xafeer.workers.dev/ws');

        ws.onopen = () => {
            console.log('WebSocket connection opened');
            ws.send('Hello from client!');
            ws.send(token)
        };

        ws.onmessage = (event) => {
            console.log('Message from server:', event.data);
            try{
                const data = JSON.parse(event.data)
                if(data.replyCount!=undefined){
                    handleComment(event.data,setUserNotifcations)
                }else{
                    handleReply(event.data,setUserNotifcations)
                }
            }catch(e){
                console.error("Error parsing websocker message",e)
            }
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        };
    },[])

    useEffect(()=>{
        if (notification.comments.length!=0 || notification.replies.length!=0){
            transformNotification(notification,setUnifiedNotification,setNotificationCount)
        }
    },[notification])

    
    
    

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
    const token = useRecoilValue(tokenAtom)
    const [response,setResponse] = useState<string>()
    const [userNotificaiton,setUserNotifcations]= useRecoilState(notifications)
    const [,setUnifiedNotification] = useRecoilState(unifiedNotificationsAtom)
    const [,setAreNotifications] = useRecoilState(areNotifications)
    const [,setNotificationCount] = useRecoilState(notifiationCount)
    const setOpenBlog = useSetRecoilState(blogOpen) 
    useEffect(()=>{
        formatDate(date,setDuration)
    },[])

    const fetchBlog=async ()=>{
        setResponse(commentId)
        updateNotification(token,commentId as string,isComment,setAreNotifications,setUserNotifcations,userNotificaiton,setUnifiedNotification,setNotificationCount)
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


export const transformNotification = (notification: Notification,setUnifiedNotification:Dispatch<SetStateAction<UnifiedNotification[]>>, setNotificationCount:SetterOrUpdater<number>) => {
    const transformedContent: UnifiedNotification[] = [];
    let notificationCount=0;
    console.log("notifiacation inside transform",notification)
    // Transform comments
    if(notification.comments){
    for (const comment of notification.comments) {
        console.log("inside unified id of post",comment.postId)
        if (comment.flagNotified==false){
            notificationCount+=1
        }
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
        if (reply.flagNotified==false){
            notificationCount+=1
        }
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
    console.log("the number is ",notificationCount)
    transformedContent.reverse()
    setNotificationCount(notificationCount)
    setUnifiedNotification([...transformedContent]);
};
