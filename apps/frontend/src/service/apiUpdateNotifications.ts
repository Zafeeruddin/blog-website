import axios from "axios"
import { comment, Notification, Reply, UnifiedNotification } from "../utils/types"
import { SetterOrUpdater } from "recoil"
import { transformNotification } from "../components/Notification"
import { Dispatch, SetStateAction } from "react"


export const updateNotification=async (token:string,id:string,isComment:boolean,setAreNotifications:SetterOrUpdater<boolean>,setUserNotifications:SetterOrUpdater<Notification>,userNotifications:Notification,setUnifiedNotification:Dispatch<SetStateAction<UnifiedNotification[]>>,setNotificationCount:SetterOrUpdater<number>)=>{
    const headers={
        "Authorization":token,
    }
    const body={
        "responseId":id,
        "isComment":isComment
    }
    console.log("erady to updatae " + id + " bool: " + isComment )
    try{
        const response=await axios.put(`${import.meta.env.VITE_BACKEND_PROD_URL}/api/v1/user/getNotification`,body,{withCredentials:true,headers})
        console.log("noitifcaitons updated",response.data) 
        if(response.data){
            const replies:Reply[]=response.data.replies
            const comments:comment[]=response.data.comments
            console.log("repsonse in notificaitons",response.data)
            // console.log("before",areNotifications)
            if(replies && replies.length===0 && comments.length===0){
                console.log("notifications not in")
                // setAreNotifications(false)
                setAreNotifications(false)
                return
            }else{
                setAreNotifications(true)
                await setUserNotifications(response.data)
                console.log("ready to transform")
                transformNotification(userNotifications,setUnifiedNotification,setNotificationCount)
            }
        }
    }catch(e){
        console.log(e)
    }
}
