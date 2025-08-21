
import {  tokenTypes, verfiyToken } from "../../utils/security/token.security.js";
import * as dbService from "../../DB/db.service.js"
import {userModel} from "../../DB/model/User.model.js";
import { asyncHandler } from "../../utils/res/error.response.js";
export const authentication =asyncHandler(async ({authorization="",tokenType=tokenTypes.access ,accessRoles=[],chekAuthorizion=false}={}) => {
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
    if (chekAuthorizion&&!accessRoles.includes(user.role)) {
      throw new Error("not authroized account")
    }
  
    return user;
  }
)