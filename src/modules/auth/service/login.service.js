
import {userModel, providerTypes, roleTypes } from "../../../DB/model/User.model.js";
import { emailEvent } from "../../../utils/event/email.event.js";
import { asyncHandler } from "../../../utils/res/error.response.js";
import { successResponse } from "../../../utils/res/success.res.js";
import { compareHush } from "../../../utils/security/hush.security.js";
import { decodedToken, generateToken, verfiyToken } from "../../../utils/security/token.security.js";
import {OAuth2Client}  from'google-auth-library';
import * as dbService  from "../../../DB/db.service.js"
import { tokenTypes } from "../../../utils/security/token.security.js";

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await dbService.findOne({model:userModel,filter: {email} });
   if (user.banUntil && user.banUntil > new Date()) {
    return next(
      new Error(`Account banned until ${user.banUntil.toLocaleString()}`, {
        cause: 403
      })
    );
  }
  if (!user) {
    return next(new Error("not found", { cause: 404 }));
  }
  if (!user.confirmEmail) {
    return next(new Error("confirm account first", { cause: 400 }));
  }
  const isMatch = compareHush({
    plainText: password,
    hashValue: user.password,
  });
  if (!isMatch) {
    user.loginAttempts += 1;
    if (user.loginAttempts >= 5) {
      user.banUntil = new Date(Date.now() + 30 * 60 * 1000);
      user.loginAttempts = 0; 
    }
    await user.save();
    return next(new Error("in-vaild password or email", { cause: 400 }));
  }

  user.loginAttempts = 0;
  user.banUntil = null;
  await user.save();
  const access_token = generateToken({
    payload: {id:user._id},
    signatrue:
     [ roleTypes.admin,roleTypes.superAdmin].includes(user.role)
        ? process.env.ADMIN_ACCESS_TOKEN
        : process.env.USER_ACCESS_TOKEN,
    expiresIn: 1800*60
  });
  
  const refesh_token = generateToken({
    payload:{id:user._id},
    signatrue:
   [ roleTypes.admin,roleTypes.superAdmin].includes(user.role)
        ? process.env.ADMIN_REFRESH_TOKEN
        : process.env.USER_REFRESH_TOKEN,
    expiresIn: 31536000
  });
  return successResponse({ res, message: "Done", status: 200 ,data:{access_token,refesh_token}});
});
export const loginWithGmail = asyncHandler(async (req, res, next) => {
  const { idToken } = req.body;
  const client = new OAuth2Client();
  async function verify() {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.WEB_CLIENT_ID,  // Specify the WEB_CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[WEB_CLIENT_ID_1, WEB_CLIENT_ID_2, WEB_CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return payload
  }
  const payload=await verify()



  
  if (!payload.email_verified) {
    return next(new Error("in-vaild account", { cause: 400 }));
  }
  let user = await dbService.findOne({model:userModel,filter: {email:payload.email,provider:providerTypes.system} });
 if (!user) {
  await dbService.create({
    model:userModel,data:{userName:payload.name,
email:payload.email,
confirmEmail:payload.email_verified,
image:payload.picture,
provider:providerTypes.google}

   })
 }if (user.provider!=providerTypes.google) {
  return next(new Error("in-vaild provider",{cause:400}))
 }
  // const isMatch = compareHush({
  //   plainText: password,
  //   hashValue: user.password,
  // });
  // if (!isMatch) {
  //   return next(new Error("in-vaild password or email", { cause: 400 }));
  // }
  const accessToken = generateToken({
    payload: {id:user._id},
    signatrue:
      user.role === roleTypes.admin
        ? process.env.ADMIN_ACCESS_TOKEN
        : process.env.USER_ACCESS_TOKEN,
    expiresIn: 1800
  });
  const refeshToken = generateToken({
    payload:{id:user._id},
    signatrue:
      user.role === roleTypes.admin
        ? process.env.ADMIN_REFRESH_TOKEN
        : process.env.USER_REFRESH_TOKEN,
    expiresIn: 31536000
  });
  return successResponse({ res, message: "login", status: 200,data:{token:{refeshToken,accessToken},
  //  payload
  }});
});
export const refesh_token=asyncHandler(async(req,res,next)=>{
const {authorization}=req.headers;
const user= await decodedToken({authorization,tokenType:tokenTypes.refresh,next}) 

//console.log("Decoded token: ", decoded);
const refeshToken = generateToken({
  payload:{id:user._id},
  signature:
    user.role === roleTypes.admin
      ? process.env.ADMIN_REFRESH_TOKEN
      : process.env.USER_REFRESH_TOKEN,
  expiresIn: 31536000
});
const accessToken = generateToken({
  payload: {id:user._id},
  signatrue:
    user.role === roleTypes.admin
      ? process.env.ADMIN_ACCESS_TOKEN
      : process.env.USER_ACCESS_TOKEN,
  expiresIn: 1800
});


return successResponse({res,data:{token:{refeshToken,accessToken}}})
})
export const forgotPassword= asyncHandler(async(req,res,next)=>{
  const{email}=req.body;
  const user =await dbService.findOne({model:userModel,filter: {email,isDeleted:false}})
  if (!user) {
    return next(new Error("in-vaild account",{cause:404}))
  }
   if (!user.confirmEmail) {
    return next(new Error("verify your account",{cause:400}))
   }
   emailEvent.emit("forgotPassword",{id:user._id,email})
   return successResponse({res})

})
export const vaildRestPassword= asyncHandler(async(req,res,next)=>{
  const{email,code}=req.body;
const user =await dbService.findOne({model:userModel,filter:{ email,isDeleted:false}})
  if (!user) {
    return next(new Error("in-vaild account",{cause:404}))
  }
  console.log({ code, userOTP: user.restPasswordOTP });
   if (!user.confirmEmail) {
    return next(new Error("verify your account",{cause:400}))
   }
   if (!await compareHush({plainText:code,hashValue:user.restPasswordOTP})) {
    return next(new Error("In-vaild rest otp",{cause:400}))
   }
 

   return successResponse({res})

})
export const restPassword= asyncHandler(async(req,res,next)=>{
  const{email,code,password}=req.body;
  const user =await dbService.findOne({model:userModel,filter:{email,isDeleted:false} })
  if (!user) {
    return next(new Error("in-vaild account",{cause:404}))
  }
  console.log({ code, userOTP: user.restPasswordOTP });
   if (!user.confirmEmail) {
    return next(new Error("verify your account",{cause:400}))
   }
   if (!await compareHush({plainText:code,hashValue:user.restPasswordOTP})) {
    return next(new Error("In-vaild rest otp",{cause:400}))
   }
  await dbService.findOneAndUpdate({
  model: userModel,
  filter: { email },
  data: {
    $set: {
      password,
      chanageCridentialsTime: Date.now()
    },
    $unset: {
      restPasswordOTP: 0
    }
  },
  options: {
    new: true 
  }
});

  
   return successResponse({res})

})