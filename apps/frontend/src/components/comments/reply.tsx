import { useEffect, useState } from "react"
import { formatDate } from "../../utils/formatDate"
import { Reply } from "../../utils/types"
import { useRecoilValue } from "recoil"
import { tokenAtom } from "../../store/atoms/user"
import { PiHandsClappingDuotone } from "react-icons/pi"
import { clapReplyOnce } from "../../service/apiClapReply"

export const Replies=({reply}:{reply:Reply})=>{
    const [duration,setDuration]=useState("")
    const token=useRecoilValue(tokenAtom)
    const [claps,setClaps]=useState(reply.claps)

    useEffect(()=>{
        formatDate(reply.date,setDuration)
    },[])

    const callClap=()=>{
         clapReplyOnce(token,reply.id,reply.commentId,setClaps)    
    }

    return (
        <>
            <div className="pl-4 pr-4">
            <div className="border-b pb-8 mt-12 pl-4">
                <div className="flex justify-start space-x-4 -space-y-1">
                    <div className= "flex justify-center items-center rounded-full text-xl capitalize bg-orange-900 w-10 h-10  text-center font-semibold text-white ">{reply.user[0] ? reply.user[0] :"A"}</div>
                    <div>
                        <div className="text-md font-semibold">{reply.user ? reply.user : "Anonymous"}</div>
                        <div className="text-sm text-gray-500">{ duration== "now" ? "now" : duration + " ago"}</div>
                    </div>
                </div>
                <div className="mt-4 mb-3 ml-1 mr-1">{reply.reply}</div>
                <div className="flex justify-between">
                    <div className=" flex " >
                        <PiHandsClappingDuotone onClick={callClap} className="cursor-pointer mt-1 mr-2"/>
                        <div className="text-md text-gray-500">{claps}</div>
                    </div>
                </div>
                
            </div>

            </div>
        </>
    )
}