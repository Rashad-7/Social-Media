import * as  dotenv from "dotenv"
dotenv.config({path:"./src/config/.env.dev",debug:false})
import mongoose from "mongoose";
const connectDB=async () =>{
    return await mongoose.connect(process.env.DB_URL).then(res=>{
        console.log("DB connected");
        
    }).catch(err=>{
        console.error("fail in connect on DB");
        
    })
}
export default connectDB