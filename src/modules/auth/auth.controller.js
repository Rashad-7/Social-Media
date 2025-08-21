
import { Router } from 'express'
// import { signup } from './service/registration.service.js';
import * as validtors from "./auth.validtaion.js"
import * as registrationService from './service/registration.service.js';
import { validation } from '../../middleware/vaildtaion.middleware.js';
import { forgotPassword, login, loginWithGmail, refesh_token, restPassword, vaildRestPassword } from './service/login.service.js';

const router = Router();


router.post("/signup", validation(validtors.Signup),registrationService.signup)
router.patch("/confirmEmail",registrationService.confirmEmail)
router.post("/login", validation(validtors.login),login)
router.post("/loginWithGamil",loginWithGmail)

router.get("/refresh_token",refesh_token)
// router.patch("/forgot-password",validation(validtors.forgetPassword),forgotPassword)
router.patch("/validteForgot-password",validation(validtors.vaildteForgetPassword),vaildRestPassword)
router.patch("/forgot-password",validation(validtors.forgetPassword),forgotPassword)
router.patch("/rest-password",validation(validtors.restPassword),restPassword)



export default router