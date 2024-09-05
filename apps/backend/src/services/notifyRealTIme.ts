import { upgradeWebSocket } from "hono/cloudflare-workers";
import { comment,reply } from "../types/post";
import { clients } from "./declarations";
import { verifyToken } from "./getUser";

export default function sendMessageToUser(userId: string, response: comment | reply) {
    console.log("Hello from user, the user id is " + userId+" and comment: " + response)
    const connection = clients.get(userId);
    for (let [idx,ws] of clients.entries()){
      console.log("Client: " + idx  + ws)
      // console.log("connection " + )
    }
    upgradeWebSocket((c) => {
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
            
            clients.set(userId,ws)
            for (let [userId] of clients.entries()){
              console.log(userId)
            }
          }
          ws.send('Hello from server!')
        },}})
    try{
    if (connection?.readyState === WebSocket.OPEN) {
      console.log("connection is open")
      // console.log("Connection open ready to send",connection)
      connection.send(JSON.stringify(response));
      return
    } else {
      console.log(`No active WebSocket connection for user ${userId}`);
      return 
    }
  }catch(e){
    console.log("error sending further",e)
  }

}