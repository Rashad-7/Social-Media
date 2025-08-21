import Joi from "joi";
import { generalFields } from "../../middleware/vaildtaion.middleware.js";

export const Signup = {
    body: Joi.object({
      userName:generalFields.userName.required(),
  
      email: generalFields.email .required(),
  
      password: generalFields.password .required(),
  
      phone:generalFields.phone .required(),
  
      confirmPassword:generalFields.confirmPassword .required()
    }).required(),
  }
  export const comfirmEmail = {
    body: Joi.object({
      email: generalFields.email .required(),
      code: generalFields.code. required()
    }).required(),
  }
  export const login = {
    body: Joi.object({
      email: generalFields.email .required(),
      password: generalFields.password. required()
    }).required(),
  }
  
  export const forgetPassword = {
    body: Joi.object({
      email: generalFields.email .required(),
    }).required(),}
    export const vaildteForgetPassword = {
      body: Joi.object({
        email: generalFields.email .required(),
        code:generalFields.code .required()
      }).required(),}
      export const restPassword = {
        body: Joi.object({
          email: generalFields.email .required(),
          code:generalFields.code .required(),
          password:generalFields.password.required()
        }).required(),}