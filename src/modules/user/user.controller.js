import { Router } from "express";
import { authentication, authorization } from "../../middleware/auth.middleware.js";
import { profile, resetEmail, updateEmail, updatePassword,sendFriendRequest, responseFriendRequest,updateProfile,dashboard,updateProfileImage ,updateProfilecoverImage,updateProfileIdntity, chanageRoles} from "./services/user.service.js";
import { shareProfile } from "./services/user.service.js";
import { validation } from "../../middleware/vaildtaion.middleware.js";
import *as validators from "../user/user.validation.js"
import { fileValidations, uploadFileDisk } from "../../utils/multer/local.multer.js";
import { uploadCloudFile } from "../../utils/multer/cloud.multer .js";
import { endpoint } from "./services/user.authoriztion.js";
const router = Router();
router.patch("/profile/friends/:friendId",authentication(),sendFriendRequest )
router.patch("/profile/friends/:friendRequestId/response",authentication(),responseFriendRequest )

router.get("/profile",authentication(),profile )
router.get("/profile/dashboard",authentication(),authorization(endpoint.chanageRoles),dashboard )
router.patch("/:userId/profile/dashboard/role",authentication(),authorization(endpoint.chanageRoles),chanageRoles )
router.patch("/profile/email",validation(validators.updateEmail),authentication(),updateEmail); 
router.get("/profile/:profileId",validation(validators.shareProfile),authentication(),shareProfile);
router.patch("/profile/reset_email",validation(validators.reset_email),authentication(),resetEmail); 
router.patch("/profile/update_password",validation(validators.updatePassword),authentication(),updatePassword); 
router.patch("/profile",validation(validators.updateProfile),authentication(),updateProfile )
router.patch("/profile/image",
    uploadCloudFile(fileValidations.image).single('attachment')
    ,authentication(),updateProfileImage)
    router.patch("/profile/cover",
    uploadFileDisk('user/profile',fileValidations.image).array('cover',3)
    ,authentication(),updateProfilecoverImage)
       router.patch("/profile/idntity",
    uploadFileDisk('user/profile',[...fileValidations.document,...fileValidations.image]).fields([{ name: 'image', maxCount: 1 }, { name: 'cover', maxCount: 3 }])
    ,authentication(),validation(validators.profileImage),updateProfileIdntity)


export default router;