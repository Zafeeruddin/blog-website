import {PrismaClient} from '@prisma/client/edge'
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
      endpoint:string,
      ACCESS_KEY_ID:string,
      secretAccessKey:string,
      MJ_APIKEY_PUBLIC:string,
      MJ_APIKEY_PRIVATE:string
    },
    Variables:{
        key:CryptoKey,
        id:string,
    }
  }>()


//Middleware for verification of tokens
userRouter.use("/getNotification",async (c,next)=>{
                            
    var token=  getCookie(c,"token") || c.req.header("Authorization")  || ""
    console.log("token in auth",token)
    if(!token){
        c.status(401)
        console.log("unauthorized")
        return c.json({"error":"unauthorized"})
    }
    console.log("token got is",token)
    if(token){
        try{
            const verifiedToken=await verify(token,c.env.JWT_SECRET)
            if(!verifiedToken){
                c.status(401)
                return c.json("The token has been altered")
            }

            const decodedToken= decode(token)
            console.log("id set is",decodedToken.payload.id)
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
    if(!getUserByEmail || getUserByEmail && !getUserByEmail.googleId){
       await next()
    }
    c.status(409)
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

    let user = await prisma.user.findUnique({
        where:{
            email:body.email
        }
    })

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
        if(user){
            user = await prisma.user.update({
                where:{
                    email:body.email
                },data:{
                    password:decodedPassword
                }
            })
        }else{
            user=await prisma.user.create({
                data:{
                    name:body.name,
                    email:body.email,
                    password:decodedPassword      
                }
            })
        }

        const getNotification = await prisma.notification.findUnique({
            where:{
                userId:user.id
            }
        })
        if(!getNotification){
            await prisma.notification.create({
                data:{
                    userId:user.id
                }
            })
    }
        const payload={
                id:user.id,
                exp:Math.floor(Date.now()/1000)+60*60*24
            }

        const token= await sign(payload,c.env.JWT_SECRET)
        console.log("token",token)


        setCookie(c,"token",token,{
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
            "name": user.name
        })
    }    
    catch(e){
        c.status(403)
        return c.json({
            "msg"   : "Error creating user",
            "error" : e
        })
    }   
  })

  userRouter.post("/googleAuth",async(c)=>{
    const body= await c.req.json()
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const googleImage = body.googleImage
    try{
        let user=await prisma.user.findUnique({
        where:{
            email:body.email
        }
        })
        
        if(!user){
            user= await prisma.user.create({data:{
                email:body.email,
                googleId:body.googleId,
                name:body.name,
            }})
            const getNotification = await prisma.notification.findUnique({
                where:{
                    userId:user.id
                }
            })
            if(!getNotification){
                await prisma.notification.create({
                    data:{
                        userId:user.id
                    }
                })
        }
        }else{
            if (!user.googleId){
                user = await prisma.user.update({
                    where:{
                        id:user.id
                    },
                    data:{
                        googleId:body.googleId
                    }
                })
            }
        }
        if(!user.googleId){
            console.log("no google")
            return
        }
        if(user.googleImage ){
            if(googleImage!=user.googleImage){
                await prisma.user.update({
                    where:{
                        googleId:user.googleId
                    },data:{
                        googleImage
                    }
                })
            }
        }else{
            await prisma.user.update({
                where:{
                    googleId:user.googleId
                },data:{
                    googleImage
                }
            })
            console.log("updated the image")
        }
        const payload={
            id:user.id,
            exp:Math.floor(Date.now()/1000)+60*60*24
        }
        
        const token= await sign(payload,c.env.JWT_SECRET)
        console.log("token",token)
        setCookie(c,"token",token,{
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
            "name": user.name,
            "googleImage":user.googleImage
        })
    }catch(e){
        return c.json({msg:"Email already exists",e:e})
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
        path:"/",
        sameSite:"None",
        secure:true
    })
    c.header("Authorization",token)
    c.status(201)
    return c.json({
        msg:"Signup successfully",
        "token":token,
        "name": getUser.name,
        "googleImage":getUser.googleImage
    })
}catch(e){
    return c.json({msg:"Email already exists",e:e})
}

})


  userRouter.post("/signout",async(c)=>{
    deleteCookie(c, 'token', {

        path:"/",
        sameSite:"None",
        secure:true,
	});
    c.status(200)
    return c.json("Signed out successfully")
  })
  

  
  userRouter.get("/getNotification",async(c)=>{
    const userId=c.get("id")
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())
    
    try{
        const getNotifications=await prisma.notification.findUnique({
            where:{
                userId:userId
            }
        })
        if(!getNotifications){
            console.log("inside no not")
            c.status(404)
            return c.json("No Notifications exists")
        }
        console.log("inside noti in not")

        const getComments=await prisma.comments.findMany({
            where:{
                notificationId:getNotifications.id
            }
        })
        console.log("comment in not",getComments)


        const getReplies=await prisma.replies.findMany({
            where:{
                notificationId:getNotifications.id
            }
        })
        console.log("f are",getReplies)
        c.status(200)
        return c.json({comments:getComments,replies:getReplies})

    } catch(e){
        console.log("error",e)
        return c.json({"error":e})
    }
  })


  userRouter.put("/getNotification",async(c)=>{
    const userId=c.get("id")
    const body = await c.req.json()
    const responseId= body.responseId
    const isComment= body.isComment

    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())
    

    if(isComment===true){
         await prisma.comments.update({
            where:{
                id:responseId,
            },
            data:{
                flagNotified:true
            }
        })
    }else{
         await prisma.replies.update({
            where:{
                id:responseId,
            },
            data:{
                flagNotified:true
            }
        })
    }
    const getNotifications=await prisma.notification.findUnique({
        where:{
            userId
        }
    })
    if(!getNotifications){
        return c.json("No Notifications exists")
    }
    if(!getNotifications){
        console.log("inside no not")
        c.status(404)
        return c.json("No Notifications exists")
    }
    console.log("inside noti in not")

    const getComments=await prisma.comments.findMany({
        where:{
            notificationId:getNotifications.id
        }
    })
    console.log("comment in not",getComments)


    const getReplies=await prisma.replies.findMany({
        where:{
            notificationId:getNotifications.id
        }
    })
    console.log("f are",getReplies)
    c.status(200)
    return c.json({comments:getComments,replies:getReplies})

 })

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, S3Client,GetObjectCommand } from "@aws-sdk/client-s3";
  
userRouter.get("/pre-signed-url", async(c)=>{

async function fetchUrl(blogId:string, method: "PUT" | "GET") {
    const command = method ==="GET" ? new GetObjectCommand({Bucket:"blog",Key:`blog/${blogId}`}) :
                                      new PutObjectCommand({ Bucket:"blog", Key:`blog/${blogId}`})

    
    const S3 = new S3Client({
        endpoint: c.env.endpoint,
        credentials: {
            accessKeyId: c.env.ACCESS_KEY_ID,
            secretAccessKey: c.env.secretAccessKey,
        },
        region: "auto",
    });

    
    const url = await getSignedUrl(
        S3,
        command
    )
    return url;
}
    const blogId = c.req.header("blogId") as string
    const method = c.req.header("method") as "PUT" | "GET"
   const url = await fetchUrl(blogId,method)
    return c.json(url)
  })

userRouter.post("/checkEmail",async (c)=>{
    console.log("inside check")
    const body= await c.req.json()
    const email = body.email
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())
    // @ts-ignore
    // const isEmail=await checkEmail(email,prisma)
    let isEmailNumber;
    try{
        const isUser= await prisma.user.findUnique({
            where:{
                email
            }
        })
        console.log("inside check aigin",isUser)

        if(!isUser){
            isEmailNumber= 0
        }else{
            if(isUser.googleId && isUser.password){
                isEmailNumber=1
            }else if(isUser.password && !isUser.googleId){
                isEmailNumber=2
            }else if(!isUser.password && isUser.googleId){
                isEmailNumber=3
            }
        }
        console.log("Is Email == ",isEmailNumber)
        if( isEmailNumber === 0 || isEmailNumber === 3){
            c.status(200)
            console.log("0 3")
            return c.json("Proceed")
        }else if(isEmailNumber === 1 || isEmailNumber === 2 ){
            console.log("1 or 2")
            c.status(400)
            return c.json("DO notProceed")
        }else{
            return c.json("Error")
        }
    }catch(e){
        console.log("Error ",e)
        return c.json({"e":e})
    }
})