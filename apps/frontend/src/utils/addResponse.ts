import { SetterOrUpdater } from "recoil"
import { comment, Notification, Reply } from "./types"

export const handleComment= async (data:any,setNotification:SetterOrUpdater<Notification>)=>{
    setNotification((prevNotification)=>{
        return {
            ...prevNotification,
            comments:[...prevNotification.comments,data as comment]
        }
    })
}

export const handleReply= async (data:any,setNotification:SetterOrUpdater<Notification>)=>{
    setNotification((prevNotification)=>{
        return {
            ...prevNotification,
            replies:[...prevNotification.replies,data as Reply]
        }
    })
}

