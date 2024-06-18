import { Hono } from "hono";
import { blogRouter } from "./routes/blog";
import { userRouter } from "./routes/user";
import { cors } from "hono/cors";

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




export default app;