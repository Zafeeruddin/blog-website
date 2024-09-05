// import prisma from "../../db"

export const checkEmail = async (prisma:any,email:string)=>{
    const isEmail= await prisma.user.findUnique({
        where:{
            email
        }
    })
    if(!isEmail){
        return 0
    }else{
        if(isEmail.googleId && isEmail.password){
            return 1
        }else if(isEmail.password && !isEmail.googleId){
            return 2
        }else if(!isEmail.password && isEmail.googleId){
            return 3
        }
    }
}