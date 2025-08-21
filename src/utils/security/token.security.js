import jwt from "jsonwebtoken"
import {userModel} from "../../DB/model/User.model.js"
import { asyncHandler } from "../res/error.response.js"
import * as dbService from "../../DB/db.service.js";
export const generateToken=({payload={},signature=process.env.USER_ACCESS_TOKEN,expiresIn=process.env.EXPIRESIN})=>{
    const token= jwt.sign(payload,signature,{expiresIn:parseInt(expiresIn) })
    return token
}
export const verfiyToken=({token,signature=process.env.USER_ACCESS_TOKEN})=>{
    const decoded= jwt.verify(token,signature)
    return decoded
}
export const tokenTypes={
    access:"access",
    refresh:"refresh",
}
export const decodedToken = async ({ authorization="" , tokenType = tokenTypes.access,next={} }) => {
  const [bearer, token] = authorization?.split(" ") || [];
if (!bearer || !token) {
    throw new Error("missing token");
  }
let  access_signature='';
let refresh_signature='';
  switch (bearer) {
    case 'system':
      access_signature = process.env.ADMIN_ACCESS_TOKEN;
      refresh_signature = process.env.ADMIN_REFRESH_TOKEN;
      break;
    case 'bearer':
      access_signature = process.env.USER_ACCESS_TOKEN;
      refresh_signature = process.env.USER_REFRESH_TOKEN;
      break;
    default:
      throw new Error("Invalid token type");
  }

  
  const decoded = verfiyToken({
    token,
    signature: tokenType === tokenTypes.access ? access_signature : refresh_signature 
  });

  if (!decoded?.id) {
    throw new Error("Invalid token payload",{cause:401});
  }

  const user = await dbService.findOne({
    model: userModel,
    filter: { _id: decoded.id, isDeleted: {$exists:false} }
  });
  if (!user) {
    throw new Error("User not found",{cause: 404 });
  }

  if (user.chanageCridentialsTime?.getTime() >= decoded.iat * 1000) {
    throw new Error("Invalid login credentials",{cause: 400 });
  }

  return user;
};
