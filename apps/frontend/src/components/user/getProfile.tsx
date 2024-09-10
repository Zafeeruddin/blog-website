import { useEffect } from "react"

export const GetProfile=({gProfile,username}:{gProfile:string | undefined,username:string})=>{
    useEffect(()=>{
        console.log("gprofile is",gProfile)
        console.log("usernmae is",username)
    },[])
    return (
        <>
            {
                gProfile && gProfile.length>0 ? <img className=" rounded-full" src={gProfile}></img>:
               <span className="uppercase">{username[0]}</span>
            }
        </>
    )
}