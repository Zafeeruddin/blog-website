import { SetterOrUpdater} from "recoil"
import axios from "axios"
import { Reply, comment } from "../utils/types"



export const publishReply=async (token:string,reply:string,commentId:string,setUserReplies:SetterOrUpdater<Reply[]>,setUserComments:SetterOrUpdater<comment[]>,comments:comment[])=>{

    console.log("ready to reply",commentId)
    const headers={
        "Authorization":token,
    }
    const body={
        "reply":reply,
        "commentId":commentId
    }
    try{

    const response = await axios.post("https://backend.mohammed-xafeer.workers.dev/api/v1/blog/post/replies",body,{withCredentials:true,headers})
    console.log("reply is published...")
    
    setUserReplies(response.data.replies)
    updateComment(comments,setUserComments,commentId,response.data.comment)
    console.log("commetns now",comments)
    console.log("replies",response.data)
    }catch(e){
        console.log(e)
    }
    console.log("publish")
}


const updateComment=(comments:comment[],setUserComments:SetterOrUpdater<comment[]>,commentId:string,newComment:comment)=>{
    const index = comments.findIndex(comment => comment.id === commentId);
    console.log("comment ",index)
    console.log("commetns are",comments)
    const newUserComments:comment[]=[...comments]
    newUserComments.splice(index,1);
    newUserComments.push(newComment)
    newUserComments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date
    setUserComments([...newUserComments])
}