import { useEffect, useState } from "react"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { tokenAtom } from "../../store/atoms/user"
import { blogOpen, cancelComment, currentCommentId, replies, usernameReply } from "../../store/atoms/post"
import { formatDate } from "../../utils/formatDate"
import { clapOnce } from "../../service/apiClapComment"
import { PiHandsClappingDuotone } from "react-icons/pi"
import { FaRegComment } from "react-icons/fa"
import { CommentBox } from "./CommentBox"
import { fetchReplies } from "../../service/aptGetReplies"
import { Replies } from "./reply"


export const CommentsCard=({commentId,user,date,comment,clap,replyCount}:{  commentId: string; user: string; date: Date; comment: string; clap: number; replyCount: number; })=>{
    const [duration,setDuration]=useState("")
    const token=useRecoilValue(tokenAtom)
    const blog=useRecoilValue(blogOpen)
    const [cancel,setCancel]=useRecoilState(cancelComment)
    const [clapped,setClapped]=useState(clap)
    const commentReply=useRecoilValue(replies)
    const [currentComment,setCurrentComment]=useRecoilState(currentCommentId)
    const [,setCurrentReplies]=useRecoilState(replies)
    const setReplyUsername=useSetRecoilState(usernameReply)
    const [showReplies,setShowReplies] = useState(false)
    const [prevCommentId,setPrevCommentId]=useState("")

    const giveReply=()=>{
        console.log("cancel was ",cancel)
        setCurrentComment(commentId);
        setReplyUsername(user)
        console.log("now current id",currentComment)
        setCancel(!cancel)
        console.log("cancel is ",cancel)
    }
    useEffect(()=>{
        formatDate(date,setDuration)
    },[])


    const getReplies=async ()=>{
        setPrevCommentId(currentComment)
        setCurrentComment(commentId)
    // setHanleReplies(!handleReplies)
    // if(handleReplies){
        console.log("comment id now ",commentId)
        console.log("prev comm id ", prevCommentId)


        if(prevCommentId===commentId){
            if(showReplies===true){
                console.log("Ur clicking same")
                setShowReplies(false)
            }else{
                console.log("OTher is open and u click something else")
                setCurrentReplies([])
                await fetchReplies(token,commentId,setCurrentReplies)
                setShowReplies(true)
            }
        }else{
            console.log("Fetching normal replies")
            setCurrentReplies([])
            await fetchReplies(token,commentId,setCurrentReplies)
            setShowReplies(true)
        }
    }
    
    const callClap=()=>{
        clapOnce(token,blog,commentId,setClapped)
    }

   
    return (
        <>  
            
            <div className="border-b pb-8 mt-12 pl-4" id={`${commentId}`}>
                <div className="flex justify-start space-x-4 -space-y-1">
                    <div className= "flex justify-center items-center rounded-full text-xl capitalize bg-orange-900 w-10 h-10  text-center font-semibold text-white ">{user[0] ? user[0] :"A"}</div>
                    <div>
                        <div className="text-md font-semibold">{user ? user : "Anonymous"}</div>
                        <div className="text-sm text-gray-500">{ duration== "now" ? "now" : duration + " ago"}</div>
                    </div>
                </div>
                <div className="mt-4 mb-3 ml-1 mr-1">{comment}</div>
                <div className="flex justify-between">
                    <div className=" flex " >
                        <PiHandsClappingDuotone onClick={callClap} className="cursor-pointer mt-1 mr-2"/>
                        <div className="text-md text-gray-500">{clapped}</div>
                        {replyCount==0 ? "" : <div className="flex space-x-2 text-gray-500 mb-1">
                            <FaRegComment onClick={getReplies}    className=" ml-5 mt-1 cursor-pointer"/> 
                            <div >{replyCount}</div> 
                        </div>}
                    </div>
                    <div onClick={giveReply} className="mr-4 text-sm cursor-pointer">Reply</div>
                </div>
                {!cancel && currentComment===commentId && <div className="mt-4 ml-2 mr-4 pr-10 pl-10 border-l-4">
                    <CommentBox isMain={false}/>
                </div> }
                {  commentReply.length!==0 && commentId===currentComment && showReplies &&
                <div className="border-l-2 border-gray-300 ml-6" onClick={()=>setShowReplies(!showReplies)}>
                    {Array.isArray(commentReply) && commentReply.map(reply=>{
                        return <Replies  key={reply.id} reply={reply}/>
                    })}
                </div>
                }
            </div>
        </>
    )
}
