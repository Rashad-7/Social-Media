import { socketConnection } from "../../../DB/model/User.model.js";
import { authentication } from "../../../middleware/Socket/auth.middleware.js";

export const registerSockey=async(socket)=>{
const {data,valid}= await authentication({socket})

// console.log({data,valid});
if (!valid) {
return    socket.emit("socket_Error",data)
}
socketConnection.set(data?.user._id.toString(),socket.id)
return  "Done"
}
export const logoutSocketId=async(socket)=>{
 return socket.on("disconnect",async()=>{
         const {data,valid}= await authentication({socket})
// console.log({data,valid});
if (!valid) {
return    socket.emit("socket_Error",data)
}
socketConnection.delete(data.user._id.toString())
return  "Done"})}