// import prisma from "../../db"

export const checkEmail = async (prisma:any,email:string)=>{
    let isEmail;
    try{
        isEmail= await prisma.user.findUnique({
            where:{
                email
            }
        })
    }catch(e){
        console.log(e)
    }
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