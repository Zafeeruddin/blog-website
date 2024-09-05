import { Hono } from "hono";
import { blogRouter } from "./routes/blog";
import { userRouter } from "./routes/user";
import { cors } from "hono/cors";
import { upgradeWebSocket } from 'hono/cloudflare-workers'
import { verifyToken } from "./services/getUser";
import { WSContext } from "hono/ws";
import {Redis} from "@upstash/redis/cloudflare"
import "./routes/mail"




const app=new Hono<{
  Variables:{
    key:CryptoKey
  }
}>()


const corsOptions = {
  origin: ["https://d2igw17rsdsjju.cloudfront.net",'http://127.0.0.1:5173',"http://localhost:5173",],
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use("/api/*",cors(corsOptions))

app.route("/api/v1/blog",blogRouter)
app.route("api/v1/user",userRouter)

app.get('/ws', upgradeWebSocket((c) => {
    return {
      async onMessage(event, ws) {
        // const response = JSON.parse(event.data)
        console.log(`Message from client: ${event.data}`)
        const message = JSON.parse(event.data as string);
        if(message.type==="token"){
          const token = message.payload
          const {userId} = await verifyToken(c,token) 
          if(!userId){
            return 
          }
          console.log("THe id of user is",userId)
          try{
          const redis = new Redis({
              url:c.env.UPSTASH_REDIS_REST_URL,
              token:c.env.UPSTASH_REDIS_REST_TOKEN
          })
          const listKey = c.env.LIST_KEY as string
          const listLength = await redis.llen(listKey);
          console.log("key is",listKey)
          console.log("llen is",listLength)
          for (let i=0;i<listLength;i++ ){
              const item = await redis.lindex(listKey,i)
              console.log("ITem got is ",item)
              // const parsedItem = JSON.parse(item)
              const authorId = item.authorId
              console.log("here the id is " + authorId + " === " + userId)
              if (userId==authorId){
                console.log("Ready to sned")
                  ws.send(JSON.stringify(item.response))
                  await redis.lrem(listKey,1,item)
              }
          }
        }catch(e){
          console.log("THe error is",e)
        }
         
        }
      },
    }
  })
)

export default app;