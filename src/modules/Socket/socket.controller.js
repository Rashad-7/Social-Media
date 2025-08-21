import { Server } from "socket.io"
import { logoutSocketId, registerSockey } from "./services/auth.service.js";
import { sendMessage } from "./services/message.service.js";
export const runIo=(httpServer)=>{
    


const io =new Server(httpServer,{cors:"*"})

return io.on("connection",async(Socket)=>{
    await registerSockey(Socket)
    await logoutSocketId(Socket)    
    await sendMessage(Socket)
})}