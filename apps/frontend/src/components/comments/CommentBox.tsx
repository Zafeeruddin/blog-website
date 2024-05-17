import {  useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { tokenAtom, usernameAtom } from "../../store/atoms/user"
import {  blogOpen, comments, currentCommentId, replies, userComment, usernameReply } from "../../store/atoms/post"
import { useEffect, useRef, useState } from "react"
import { publishComment } from "../../utils/postComment"
import { publishReply } from "../../service/apiPostReply"

export const CommentBox=({isMain}:{isMain:boolean})=>{
    const user=useRecoilValue(usernameAtom)
    const [cancel,setCancel]=useState(false)
    const [write, setWrite]=useState(false)
    const token=useRecoilValue(tokenAtom)
    const blog= useRecoilValue(blogOpen)
    const ref=useRef<HTMLTextAreaElement>(null)
    const [userComments,setUserComments]=useRecoilState(comments)
    const setUserReplies=useSetRecoilState(replies)
    const[comment, setComment]=useRecoilState(userComment)
    const [commentId,]=useRecoilState(currentCommentId)
    const replyUsername=useRecoilValue(usernameReply)

    const sendComment=()=>{
        publishComment(token,blog,comment,setUserComments)
    }

    const sendReply=()=>{
        console.log("replying...")
        publishReply(token,comment,commentId,setUserReplies,setUserComments,userComments)
    }

    const send=()=>{
        if(ref.current){
            ref.current.value=""
        }
        if(isMain){
            sendComment()
        }else{
            sendReply()
        }
    }

    useEffect(()=>{
        if(comment.length==0){
            console.log("changin false")
            setWrite(false)
        }else if(comment.length>0){
            console.log("changin true")
            setWrite(true)
        }

        return ()=>{
            setWrite(false)
        }
    },[comment])
    console.log("user in is ",user)
    return (
        <>
            <div className="rounded-lg shadow-2xl">
                {isMain && <div className="flex space-x-5 pl-4 pt-4">
                    <div className="rounded-full text-lg capitalize bg-orange-900 w-8 h-8 text-center font-semibold text-white ">{user ? user[0] :"A"}</div>
                    <div className="capitalize text-lg">{user ? user :"Anonymous"}</div>
                </div>  }
                <textarea ref={ref} onClick={()=>{setCancel(false)}} onChange={(e)=>setComment(e.target.value)} placeholder={ isMain ? `What are your thoughts?` : `You are replying to ${replyUsername}`} className="mx-4 mt-2 pt-3 pl-1 pb-1  resize-none w-11/12 outline-none focus:border-b-2 focus:border-black" ></textarea>
                {!cancel && <div className={`transition-transform  duration-1000 ease-in-out transform-${cancel ? 'translate-y-full pb-1' : 'translate-y-0 pb-4'} flex justify-end space-x-8 m-4 `}>
                    <button onClick={()=>setCancel(true)} className="text-md hover:bg-gray-200 rounded-full w-24 p-1 ml-0 text-gray-400 hover:text-slate-950 font-semibold" >Cancel</button>
                    <button onClick={send}  className={`text-md rounded-full text-white mr-0 w-24 p-1 ${write ? " bg-green-600 text-white font-semibold hover:bg-green-800": "bg-green-400"}`} disabled={!write}>Respond</button>
                </div>}
            </div>

        </>
    )
}
