import {PrismaClient,Prisma} from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
//import { createHash, randomBytes } from 'crypto'
import { Hono } from 'hono'
import { decode, verify,sign } from 'hono/jwt'
import {signupParams,loginParams} from "@repo/types/types"
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'

export const userRouter = new Hono<{
    Bindings:{
      DATABASE_URL:string,
      JWT_SECRET:string,

    },
    Variables:{
        key:CryptoKey,
        id:string,
    }
  }>()


//Middleware for verification of tokens
userRouter.use("/*",async (c,next)=>{
                            
    var token=getCookie(c,"token") || c.req.header("Authorization") || ""
    console.log("token in auth",token)
    if(!token){
        c.status(401)
        return c.json({"error":"unauthorized"})
    }
    if(token){
        try{
            const verifiedToken=await verify(token,c.env.JWT_SECRET)
            if(!verifiedToken){
                c.status(401)
                return c.json("The token has been altered")
            }

            const decodedToken= decode(token)
            const prisma=new PrismaClient({
                datasourceUrl:c.env.DATABASE_URL
            }).$extends(withAccelerate())
            c.set("id",decodedToken.payload.id as string)
           await next()
        }catch(e){
            console.log("errors",e)
            return c.json({
                "msg":e 
            })
        }
    }
    

})


//Ensures no other user exists
userRouter.use('/signup',async (c,next)=>{
    console.log("inside signup middleware")
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const body=await c.req.json()
    const getUserByEmail=await prisma.user.findUnique({
      where:{
        email:body.email
      }
    })
    
    const signupValid=signupParams.safeParse({
        username:body.name,
        email:body.email,
        password:body.password
    })
    if(!signupValid.success){
        return c.json({"msg":"error signing in","error":signupValid.error})
    }
    if(!getUserByEmail){
       await next()
    }

    return c.json({"msg":"Email already exists"})
})  

  
  
  
  userRouter.post("/signup",async (c)=>{
    
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())
    const body=await c.req.json();


    const signinParams=signupParams.safeParse({
        username:body.name,
        email:body.email,
        password:body.password
    })
    if(!signinParams.success){
        console.log("sigin failed",signinParams.error.errors)
        c.status(400)
        return c.json({msg:"Inputs are incorrect"})
    }
    const encodedPassword=new TextEncoder().encode(body.password)
    const myDigest=await crypto.subtle.digest(
        {
            name:"SHA-256"
        },
        encodedPassword
    )
    const decoder=new TextDecoder();
    const decodedPassword=decoder.decode(myDigest)
    console.log("passwrod to be ", new Uint8Array(myDigest))
  

  
    try {
        //easier way triying
        
        const user=await prisma.user.create({
            data:{
                name:body.name,
                email:body.email,
                password:decodedPassword      
            }
            })
        console.log(user, "user is ")
        const payload={
        id:user.id,
        exp:Math.floor(Date.now()/1000)+60*5}
        const token= await sign(payload,c.env.JWT_SECRET)
        console.log("token",token)

        const notification = await prisma.notification.create({
            data:{
                userId:user.id
            }
        })
        console.log(notification)
        return c.json({token})
        }    
    catch(e){
        c.status(403)
        return c.json({
            "msg"   : "Error creating user",
            "error" : e
        })
    }   
  })
  
  userRouter.post("/signin",async (c)=>{
    const body=await c.req.json()
    const signinParams=loginParams.safeParse({
        email:body.email,
        password:body.password
    })
    if(!signinParams.success){
        console.log("sigin failed",signinParams.error.errors)
        c.status(400)
        return c.json({msg:"Inputs are incorrect"})
    }
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try{
        const getUser=await prisma.user.findUnique({
        where:{
            email:body.email
        }
        })
        
        if(!getUser){
            c.status(403)
            return c.json({msg:"User doesn't exists"})  
        }
    
        
        console.log("user does eixistws")
        const encodedPassword=new TextEncoder().encode(body.password)
        const myDigest=await crypto.subtle.digest(
                {
                    name:"SHA-256"
                },
                encodedPassword
            )
        const decoder=new TextDecoder();
        const decodedPassword=decoder.decode(myDigest)
        if(decodedPassword!=getUser.password){
            console.log("decoded pwd",decodedPassword)
            console.log("pwd in db",getUser.password)
            c.status(404)
            return c.json({
                "msg":"Incorrect password"
            })
        }
        
    
        const token=await sign({id:getUser.id},c.env.JWT_SECRET)
        setCookie(c,"token",token,{
            httpOnly:true,
            path:"/",
            sameSite:"None",
            secure:true
        })
        c.header("Authorization",token)
        c.status(201)
        console.log("header set",c.req.header("Authorization"))
        return c.json({
            msg:"Signup successfully",
            "token":token,
            "name": getUser.name
        })
    }catch(e){
        return c.json({msg:"Email already exists",e:e})
    }
    
  })
  

  userRouter.post("/signout",async(c)=>{
    deleteCookie(c, 'token', {
		path: '/',
		sameSite: 'None',
		secure: true,
		// domain: `${c.env.Domain}`,
	});
    c.status(200)
    return c.json("Signed out successfully")
  })
  

  
  userRouter.get("/getNotification",async(c)=>{
    const userId=c.get("id")
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())
    
    const getNotifications=await prisma.notification.findUnique({
        where:{
            userId:userId
        }
    })
    if(!getNotifications){
        return c.json("No Notifications exists")
    }

    const getComments=await prisma.comments.findMany({
        where:{
            notificationId:getNotifications.id
        }
    })

    const getReplies=await prisma.replies.findMany({
        where:{
            notificationId:getNotifications.id
        }
    })
    return c.json({comments:getComments,replies:getReplies})
  })


  userRouter.put("/getNotification",async(c)=>{
    const userId=c.get("id")
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())
    console.log("id being ",userId)

    const getNotifications=await prisma.notification.findUnique({
        where:{
            userId
        }
    })
    if(!getNotifications){
        return c.json("No Notifications exists")
    }


    const updateComments = await prisma.comments.updateMany({
        where:{
            notificationId:getNotifications.id
        },data:{
            flagNotified:true
        }
    })

    
    const updateReplies = await prisma.replies.updateMany({
        where:{
            notificationId:getNotifications.id
        },data:{
            flagNotified:true
        }
    })
    const updatedNotifications = await prisma.comments.findMany({
        where:{
            notificationId:getNotifications.id
        }
    })
    return c.json(updatedNotifications)
  })