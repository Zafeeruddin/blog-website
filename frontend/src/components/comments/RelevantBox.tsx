import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { comments } from "../../store/atoms/post";
import { TiTick } from "react-icons/ti";

export const RelvantBox=({setHandleRelevant}:{setHandleRelevant:Dispatch<SetStateAction<boolean>>})=>{
    const [relevant,setRelevant]=useState(true)
    const [comment,setComments]=useRecoilState(comments)
    useEffect(() => {
    const currentComments = [...comment]; // Copy the current state
    if (relevant) {
        currentComments.sort((a, b) => b.claps - a.claps); // Sort by claps
    } else {
        currentComments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date
    }
    setComments(currentComments); // Update the state with the sorted array
    setHandleRelevant(false)
}, [relevant]);

    return (
        <>
            <div className="shadow-2xl p-6 w-48 rounded-lg">
                <div onClick={()=>{setRelevant(true); }} className={`${relevant ? "text-green-500" :""} flex mb-4 `}>{relevant ? <TiTick style={{height:"15%", width:"15%"}}/> :""} <div className={ `space-y-5 ${relevant ? "ml-2" :"ml-7"} `}> Most Relevant </div></div>
                <div onClick={()=>{setRelevant(false);}} className={`${relevant ? "" :"text-green-500" } flex `} >{relevant ? "" : <TiTick style={{height:"15%", width:"15%"}} /> }   <div className={`${relevant ? "ml-7" :"ml-2"}`}>Most Recent </div></div>
            </div>
        </>
    )
}