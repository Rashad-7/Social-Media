import {userModel} from "../../../DB/model/User.model.js"
import { emailEvent } from "../../../utils/event/email.event.js";
import { asyncHandler } from "../../../utils/res/error.response.js"
import { successResponse } from "../../../utils/res/success.res.js";
import { compareHush } from "../../../utils/security/hush.security.js";
import * as dbService  from "../../../DB/db.service.js"

export const signup =asyncHandler(async (req, res, next) => { 
    const { userName, email,password, phone } = req.body;
    if (await dbService.findOne({model:userModel,filter: {email} })) {
      return next(new Error("email exist", { cause: 409 }));
    }
    const user = await dbService.create({
     model:userModel,
     data:{ userName,
      email,
      password,
      phone}
    });
    emailEvent.emit("sendComfirmEmail",{id:user._id,email})
return successResponse({res,message:"done",status:201})
})
export const confirmEmail =asyncHandler(async (req, res, next) => { 
    const {  email, code } = req.body;
    const user=await dbService.findOne({model:userModel,filter: {email}})
    if (!user) {
      return next(new Error("in-vaild account", { cause: 404 }));
    }
    if (user.confirmEmail) {
        return next(new Error("Already confirmed", { cause: 409 }));
      }
      if (!compareHush({plainText:code,hashValue:user.confirmEmailOTP})) {
        return next(new Error("in-valid OTP",{cause:400}))
      }
      await dbService.updateOne({
  model: userModel,
  filter: { email },
  data: {
    $set: { confirmEmail: true },
    $unset: { confirmEmailOTP: 1 }
  }
});

return successResponse({res,message:"done",status:201})
})
