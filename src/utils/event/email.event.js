import { EventEmitter } from "node:events";
import { customAlphabet } from "nanoid";
import { generateHush } from "../security/hush.security.js";
import {userModel} from "../../DB/model/User.model.js";
import { sendEmail } from "../email/send.email.js";
import { verifyAccountTemplate } from "../email/template/verifyAccount.template.js";

export const emailEvent=new EventEmitter()
export const emailSubject={
     confirm_email:" confirm_Email",
     reset_password:"rest_Password",
     update_email:"updateEmail"
}
export const sendCode=async({data={},subject=emailSubject.confirm_email}={})=>{
     const {id,email}=data
     const otp=customAlphabet("0123456789",4 )()
     const hushOTP= await generateHush(otp)
     const otpExpires = Date.now() + 2 * 60 * 1000;
     let updateData={}
     switch (subject) {
          case emailSubject.confirm_email:
               updateData={confirmEmailOTP:hushOTP}
               break;
               case emailSubject.reset_password:
                    updateData={restPasswordOTP:hushOTP}
                    break;
          case emailSubject.update_email: 
               updateData={tempEmailOTP:hushOTP}    
          default:
               break;
     }
     await userModel.updateOne({_id:id},updateData)
     const html=verifyAccountTemplate({code:otp})
     await sendEmail({to:email,subject,html})
}
emailEvent.on("sendComfirmEmail",async (data)=>{
    await sendCode({data})
})
emailEvent.on("forgotPassword",async(data)=>{
 await sendCode({data,subject:emailSubject.reset_password})
})
emailEvent.on("updateEmail",async (data)=>{
    await sendCode({data,subject:emailSubject.update_email})
})