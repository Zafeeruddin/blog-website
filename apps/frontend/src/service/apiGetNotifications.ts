import axios from "axios"
import { SetterOrUpdater } from "recoil"
import { Notification, Reply, comment } from "../utils/types"

export const getNotification=async (setUserNotifications:SetterOrUpdater<Notification>,setAreNotifications:SetterOrUpdater<boolean>)=>{
    const response=await axios.get(`${import.meta.env.VITE_BACKEND_PROD_URL}/api/v1/user/getNotification`,{withCredentials:true})
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
            setUserNotifications(response.data)
        }
    }    
}

