import { Hono } from "hono"
import {PrismaClient} from "@prisma/client/edge"
import { withAccelerate } from "@prisma/extension-accelerate"
import { decode, verify } from "hono/jwt"
import {postParams} from "../../../common/dist/index"

export const blogRouter=new Hono<{
    Bindings:{
        JWT_SECRET:string,
        DATABASE_URL:string,
    },
    Variables:{
        id:string,
        blogId:string
    }
}>()


//Middleware for verification of tokens
blogRouter.use("/*",async (c,next)=>{
    var token=c.req.header("Authorization")
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
            console.log("token",verifiedToken)

            const decodedToken= decode(token)
            console.log("decoded header", decodedToken.header)
            console.log("decoded payload", decodedToken.payload.id)
            c.set("id",decodedToken.payload.id)
           await next()
        }catch(e){
            console.log("errors",e)
            return c.json({
                "msg":e 
            })
        }
    }
    

})

//zod validation    


blogRouter.use("/", async(c,next)=>{
    const method=c.req.method
    if(method!="PUT" && method!="POST"){
        await next()
    }
    const body =await c.req.json()
    const postValid=postParams.safeParse({
        title:body.title,
        content:body.content
    })
    if(!postValid.success){
        return c.json({"msg":"types ain't valid"+postValid.error})
    }
    await next()
})


blogRouter.post("/",async (c)=>{
    console.log("in blog")
    
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())
    const body=await c.req.json()
    const id=c.get("id")
    console.log("id in blog",id)
    try{
        const user=await prisma.user.findUnique({
            where:{
                id:id
            }
        })
        console.log("user in blog",user)
        if(!user){
            return c.json({
                "msg":"No user exists"
            })
        }
        
        const blog=await prisma.post.create({
            data:{
                title:body.title,
                content:body.content,
                published:true,
                authorId:user.id
            }
        })
        console.log("blog",blog)

    return c.json({"msg":"blog posted",})
  }catch(e){
    return c.json({"msg":"error posting blog","e":e})
  }
  
})


blogRouter.use('/',async (c,next)=>{
    const method=c.req.method
    if(method!="PUT"){
        await next()
    }
    const blogId=c.req.header("blogId")
    console.log("inside middleware id:",blogId)
    c.header("blogId",blogId)
    await next()

})

blogRouter.put("/",async (c)=>{
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const body=await c.req.json();
    const blogId=c.req.header("blogId")

    try{

        const updatedBlog=await prisma.post.update({
            where:{
                id:blogId
            },data:{
                title:body.title,
                content:body.content
            }
        })
        console.log("updated blog",updatedBlog)
        return c.json({"msg":"blog updated"})
    }catch(e){
        return c.json({e:e})
    }
    
})



blogRouter.get('/:id',async (c) => {
    const id = c.req.param('id')
    console.log("blog id ",id);

    try{
        const prisma=new PrismaClient({
            datasourceUrl:c.env.DATABASE_URL
        }).$extends(withAccelerate())

        const post=await prisma.post.findUnique({
            where:{
                id
            },include:{
                author:{
                    select:{
                        id:true,
                        name:true
                    }
                }
            }
        })

        return c.json(post)
    }catch(e){
        return c.json({
            err:e
        })
    }
})

blogRouter.get("/blogs/bulk",async (c)=>{
    console.log("inside bulk")
    try{
        const prisma=new PrismaClient({
            datasourceUrl:c.env.DATABASE_URL
        }).$extends(withAccelerate())
        const posts=await prisma.post.findMany({
            include:{
                author:{
                    select:{
                        id:true,
                        name:true
                    }
                }
            }
        })
        
        return c.json(posts)
    }catch(e){
        return c.json(e)
    }
    
})

blogRouter.get("/user/getAuthor",async (c)=>{
    console.log("getting author")
    const body=await c.req.json()
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())
    try{
        const user=await prisma.user.findUnique({
            where:{
                id:body.userId
            }
        })
        return c.json(user)
    }catch(e){
        return c.json(e)
    }

})


blogRouter.get("/like/posts",async(c)=>{
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())
    const userId=c.get("id")
    console.log("init")
    try{
        const user=await prisma.user.findUnique({
            where:{
                id:userId
            },
            select:{
                likedPosts:true
            }
        })
        if(!user){
            return c.json("user doens't exists")
        }
        console.log("posts",user.likedPosts)
        return c.json(user.likedPosts)
    }catch(E){
        return c.json(E)
    }
})


blogRouter.get("/save/posts",async(c)=>{
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())
    const userId=c.get("id")
    console.log("init")
    try{
        const user=await prisma.user.findUnique({
            where:{
                id:userId
            },
            select:{
                savedPosts:true
            }
        })
        if(!user){
            return c.json("user doens't exists")
        }
        console.log("posts",user.savedPosts)
        return c.json(user.savedPosts)
    }catch(E){
        return c.json(E)
    }
})

blogRouter.put("/save",async (c)=>{
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const body=await c.req.json()
    const userId=c.get("id")
    const user= await prisma.user.findUnique({
        where:{
            id:userId
        },select:{
            savedPosts:true
        }
    })

    const blog=await prisma.post.findUnique({
        where:{
            id:body.id
        }
    })
    
    if(!user || !blog){
        return c.json("invalid user or blog")
    }
    let updatedSavedPosts;
    if(body.saved){
        updatedSavedPosts=[...user.savedPosts,blog.id]
    }else{
         updatedSavedPosts=user.savedPosts.filter(postId=>postId!==blog.id)
    }

    const updatingDB=await prisma.user.update({
        where:{
            id:userId
        },data:{
            savedPosts:updatedSavedPosts
        }
    })
    return c.json(updatingDB.savedPosts)
})
    

blogRouter.put("/like",async(c)=>{
    const body=await c.req.json()
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())
    const userId=c.get("id")
    try{
        const blog=await prisma.post.findUnique({
            where:{
                id:body.id
            }
        })
        if(!blog){
            return c.json({msg:"Blog not found"})
        }
        const likes=blog.likes

        const user=await prisma.user.findUnique({
            where:{
                id:userId
            },
            select:{
                likedPosts:true
            }
        })

        let updateLikePosts;
        let updatedLikes;
        if(body.liked && user){
             updatedLikes=await prisma.post.update({
                where:{
                    id:blog.id
                },data:{
                    likes:likes+1
                }
             })
             updateLikePosts=[...user.likedPosts,blog.id]
        }else{
            updatedLikes = await prisma.post.update({
                where:{
                    id:blog.id
                },data:{
                    likes:likes-1
                }
             })
             updateLikePosts = user?.likedPosts.filter(postId => postId !== blog.id);
        }
        const updatedLikesPosts=await prisma.user.update({
            where:{
                id:userId
            },data:{
                likedPosts:updateLikePosts
            }
        })
        return c.json({likes:updatedLikes.likes,posts:updatedLikesPosts.likedPosts})
    }catch(e){
        console.log(e);
    }

})

blogRouter.post("/post/comments",async(c)=>{
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())
    const body=await c.req.json()
    const userId=c.get("id")
    console.log("inside comments")
    try{
        const user= await prisma.user.findUnique({
            where:{
                id:userId
            }
        })
        if(!user?.name){
            return c.json("user doesn't exists")
        }
        
        const blog=await prisma.post.findUnique({
            where:{
                id:body.id
            }
        })
        if(!blog){
            return c.json("blog doesn't exists")
        }

        

        const getAuthor = await prisma.user.findUnique({
            where:{
                id:blog.authorId
            }
        })
        if(!getAuthor){
            return c.json("Invalid User")
        }
        const getAuthorNotifications= await prisma.notification.findUnique({
            where:{
                userId:getAuthor.id
            }
        })
        if(!getAuthorNotifications){
            return c.json("unable to get notifications")
        }
        const comment=await prisma.comments.create({
            data:{
                comment:body.comment,
                postId:blog.id,
                userId:user.id,
                notificationId:getAuthorNotifications.id,
                user:getAuthor.name
            }
        })


        if(!comment){
            return c.json("Unable to post comments")
        }


        const comments=await prisma.comments.findMany({
            where:{
                postId:blog.id
            }
        })
        return c.json(comments)
    }catch(e){
        return c.json(e)
    }
})

blogRouter.get("/post/comments",async(c)=>{
    const blogId= c.req.header("id")
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())
    try{
        const comments=await prisma.comments.findMany({
            where:{
                postId:blogId
            }
        })
        
        if(!comments){
            return c.json("No comments")
        }
        return c.json(comments)
    }catch(e){
        return c.json("invalid blog")
    }

})

blogRouter.put("/post/comments",async(c)=>{
    const body=await c.req.json()
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try{
        const blog=await prisma.post.findUnique({
            where:{
                id:body.id
            }
        })
        if(!blog){
            return c.json("blog doesn't exists")
        }
        const comment=await prisma.comments.findUnique({
            where:{
                id:body.commentId
            }
        })
        if(!comment){
            return c.json("comment doesn't exists")
        }
        const updateClap=await prisma.comments.update({
            where:{
                id:comment.id
            },
            data:{
                claps:comment.claps+1
            }
        })

        return c.json(updateClap)
    }catch(e){
        return c.json(e)
    }
})

blogRouter.post("/post/replies",async(c)=>{
    const userId=c.get("id")
    const prisma= new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const body=await c.req.json()

    
    try{

        const getUser=await prisma.user.findUnique({
            where:{
                id:userId
            }
        })

        if(!getUser){
            return c.json("user not found")
        }
        const getComment=await prisma.comments.findUnique({
            where:{
                id:body.commentId
            }
        })
        if(!getComment){
            return c.json("Unable to find comment")
        }

        const getBlog = await prisma.post.findUnique({
            where:{
                id:getComment.postId
            }
        })
        if(!getBlog){
            return c.json("Blog doesn't exists")
        }


        // Adding notification to (A) Commentator 
        const getAuthorNotifications=await prisma.notification.findUnique({
            where:{
                userId:getComment.userId
            }
        })

        if(!getAuthorNotifications){
            return c.json("Unable to find notifications")
        }

        // Add notification to the commentator
        const createReply = await prisma.replies.create({
            data:{
                reply:body.reply,
                commentId:getComment.id,
                user:getUser.name,
                notificationId:getAuthorNotifications.id
            }
        })
        
        const getReplies=await prisma.replies.findMany({
            where:{
                commentId:getComment.id
            }
        })

        const countReplies=await prisma.replies.count({
            where:{
                commentId:getComment.id
            }
        })
        const parentComment=await prisma.comments.update({
            where:{
                id:getComment.id
            },
            data:{
                replyCount:countReplies
            }
        })
        if(!getReplies || !getComment){
            return c.json("no replies/comments in")
        }
        return c.json({"comment":parentComment,"replies":getReplies})
    }catch(e){
        return c.json(e)
    }
})


blogRouter.get("/post/replies",async (c)=>{
    const prisma= new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const commentId = c.req.header("id")

    
    try{
        const allReplies = await prisma.replies.findMany({
            where:{
                commentId:commentId
            }
        })

        if(!allReplies){
            return c.json("incorrect comment")
        }
        return c.json(allReplies)
    }catch(e){
        return c.json(e)
    }
})

blogRouter.put("/post/replies",async(c)=>{
    const body=await c.req.json()
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try{
        const comment=await prisma.comments.findUnique({
            where:{
                id:body.commentId
            }
        })
        if(!comment){
            return c.json("comment doesn't exists")
        }
        const reply=await prisma.replies.findUnique({
            where:{
                id:body.id
            }
        })
        if(!reply){
            return c.json("reply doesn't exists")
        }
        const updateClap=await prisma.replies.update({
            where:{
                id:reply.id
            },
            data:{
                claps:reply.claps+1
            }
        })

        return c.json(updateClap)
    }catch(e){
        return c.json(e)
    }
})

