import joi from "joi";
import { profile } from "./services/user.service.js";
import { generalFields } from "../../middleware/vaildtaion.middleware.js";
export const profileImage=joi.object().keys({
  file: joi.object().required(),
})
export const shareProfile=joi.object().keys(
{
    profileId:generalFields.id.required(),
}
).required()
export const reset_email=joi.object().keys(
{
  
    // email:generalFields.email.required(),
   oldCode:generalFields.code.required(),
   newCode:generalFields.code.required(),

}
).required()    
export const updateEmail=joi.object().keys(
{
  email:generalFields.email.required(),
}
).required()  
export const updatePassword=joi.object().keys(
{
  oldPassword:generalFields.password.required(),
  newPassword:generalFields.password.required(),
}
).required()  
export const updateProfile=joi.object().keys(
{
  userName:generalFields.userName ,
  DOB:generalFields.DOB,
  gender:generalFields.gender,
  phone:generalFields.phone,
  address:generalFields.address,
  
}
).required()  
