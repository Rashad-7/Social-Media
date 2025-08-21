import * as  dotenv from "dotenv"
import path from "path"
dotenv.config({path:path.resolve("./src/config/.env.dev"),debug:false})
import cloudinary  from 'cloudinary';

cloudinary.v2.config({ 
    cloud_name: process.env.CLOUD_NAME ,  
    api_key: process.env.API_KEY,
    api_secret: process.env.SCERET_KEY,
    secure: true,
});

export const cloud = cloudinary.v2;