import Joi  from "joi";
import { Types } from "mongoose";
import { genderTypes } from "../DB/model/User.model.js";
export const validation = (schema) => {
  return (req, res, next) => {
    const validationErrors = [];
    for (const key of Object.keys(schema)) {
      if (!req[key]) continue;
      const validationResult = schema[key]?.validate(req[key], { abortEarly: false });
      if (validationResult.error) {
        validationErrors.push({ key, errors: validationResult.error.details });
      }
    }
    // if (!req.file && (!req.files || req.files.length === 0)) {
    //   validationErrors.push({
    //     key: 'files',
    //     errors: ['No files were uploaded.']
    //   });
    // }
    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: 'Validation Error',
        errors: validationErrors
      });
    }

    next();
  };
};
export const isvalidObjectId = (value,helper) => {
    return Types.ObjectId.isValid(value) ? true : helper.message("Invalid ObjectId");
  }


export const generalFields = {
  userName: Joi.string().pattern(
    /^[a-zA-Z\u0621-\u064Aء-ئ][^#&<>\"~;$^%{}?]{1,20}$/
  ),
  email: Joi.string()
    .email({ maxDomainSegments: 3 })
    .pattern(/^[a-zA-Z]+\d*[a-zA-Z0-9]*@[a-z]+\.(com|edu|net)$/),
  password: Joi.string().pattern(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
  ),
  confirmPassword: Joi.string().valid(Joi.ref("password")),
  phone: Joi.string().pattern(/^(002|\+2)?01[0125][0-9]{8}$/),
  code: Joi.string().pattern(/^\d{4}$/),
  id: Joi.string().custom(isvalidObjectId),
  DOB: Joi.date().less("now"),
  gender: Joi.string().valid(...Object.values(genderTypes)),
  address: Joi.string(),
  file:Joi.object({
  fieldname: Joi.string().valid("attachment"),
  originalname: Joi.string(),
  encoding: Joi.string(),
  mimetype: Joi.string(),
  size: Joi.number(),
  destination: Joi.string(),
  filename: Joi.string(),
})
};