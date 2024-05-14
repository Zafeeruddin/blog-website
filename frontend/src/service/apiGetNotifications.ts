import axios from "axios"
import { SetterOrUpdater } from "recoil"
import { Notification, Reply, comment } from "../utils/types"

export const getNotification=async (token:string,setUserNotifications:SetterOrUpdater<Notification>)=>{
    const headers={
        "Authorization":token,
    }
    const response=await axios.get("https://backend.mohammed-xafeer.workers.dev/api/v1/user/getNotification",{headers})
    if(response.data){
        const replies:Reply[]=response.data.replies
        const comments:comment[]=response.data.comments
        console.log("repsonse in notificaitons",response.data)
        if(replies.length===0 && comments.length===0){
            return
        }else{
            console.log("notifiations set")
            setUserNotifications(response.data)
        }
    }
    

}

