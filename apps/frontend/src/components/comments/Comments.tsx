import { useRecoilState, useRecoilValue } from "recoil"
import { tokenAtom } from "../../store/atoms/user"
import { IoMdClose } from "react-icons/io";
import {  useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { blogOpen, comments } from "../../store/atoms/post";

import { getComments } from "../../service/apiGetComments";
import { CommentsCard } from "./CommentsCard";
import { RelvantBox } from "./RelevantBox";
import { CommentBox } from "./CommentBox";

export const Comments=()=>{
    const blog=useRecoilValue(blogOpen)
    const [userComments,setUserComments]=useRecoilState(comments)
    const token=useRecoilValue(tokenAtom)
    const [handleRelevant,setHandleRelevant]=useState(false)

    // Get comments 
    useEffect(()=>{
        console.log("getting comments")   
        getComments(token,blog,setUserComments);
        console.log("setted comments",userComments)

        return () =>{
            setUserComments([])
        }

    },[blog])

    return (
        <> 
            {/* Comments Section */}
            <div className="lg:p-10 md:p-10  shadow-xl mt-8">
                <div>
                    <div className="flex justify-between m-2 ">
                        <div className="text-lg font-bold">Responses ({userComments.length})</div>
                        <div className="cursor-pointer"><IoMdClose /></div>
                    </div>
                    <CommentBox isMain={true} />
                    <div className="mt-8 text-sm font-bold  cursor-pointer border-b pb-5  pl-3">
                        <div className="flex space-x-3 space-y-1 ml-2">
                            <div onClick={()=>setHandleRelevant(!handleRelevant)} className="mb-2">MOST RELEVANT</div>
                            <div> <IoIosArrowDown /></div>
                        </div>
                        <div className={` ${handleRelevant ? "display" :"hidden"}`}><RelvantBox setHandleRelevant={setHandleRelevant}/></div> 
                    </div>
                     {userComments.length!==0 && Array.isArray(userComments) && userComments.map(comment=>{
                        return <CommentsCard  key={comment.id} commentId={comment.id} user={comment.user} date={comment.date} comment={comment.comment} clap={comment.claps} replyCount={comment.replyCount}/>
                    })
                } 
                    
                </div>
            </div>
        </>
    )
}



