
import {  tokenTypes, verfiyToken } from "../../utils/security/token.security.js";
import * as dbService from "../../DB/db.service.js"
import {userModel} from "../../DB/model/User.model.js";
   
export const authentication =async ({socket={},tokenType=tokenTypes.access ,accessRoles=[],chekAuthorizion=false}={}) => {
    const [bearer, token] = socket.handshake.auth.authorization?.split(" ") || [];
if (!bearer || !token) {  
    return {data:{massage:"missing token",status:400}};
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
      return {data:{massage:"Invalid token type",status:400}};
  }

  const decoded = verfiyToken({
      token,
      signature: tokenType === tokenTypes.access ? access_signature : refresh_signature 
    });
  
    if (!decoded?.id) {
      return {data:{massage:"Invalid token payload",status:401}};
    }
  
    const user = await dbService.findOne({
      model: userModel,
      filter: { _id: decoded.id, isDeleted: {$exists:false} }
    });
  
    if (!user) {
      return {data:{massage:"User not found",status: 404 }};
    }
  
    if (user.chanageCridentialsTime?.getTime() >= decoded.iat * 1000) {
      return {data:{massag:"Invalid login credentials",status: 400 }};
    }
    if (chekAuthorizion&&!accessRoles.includes(user.role)) {
      return {data:{massage:"not authroized account",status:403}}
    }
  
    return {data:{massage:"Done",user},valid:true};
  };

