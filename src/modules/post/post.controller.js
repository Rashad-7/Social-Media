import { Router } from "express";
import * as postService from './services/post.service.js';
import * as validators from './post.validation.js';
import {endpiont} from './post.authoriztion.js'
import { validation } from "../../middleware/vaildtaion.middleware.js";
import { authentication,authorization } from "../../middleware/auth.middleware.js";
import { fileValidations, uploadCloudFile } from "../../utils/multer/cloud.multer .js";
import commentConroller from '../comment/comment.controller.js';
const router= Router();
router.use("/:postId/comment",commentConroller);
router.get("/", 
   
    authentication(),    
    postService.getAllPosts
);
router.post("/", 
   
    authentication(), 
    authorization(endpiont.createPost), 
    uploadCloudFile(fileValidations.image).array('attachments', 2),
     validation(validators.createPost),     
    postService.createPost
);
router.patch("/:postId", 
    authentication(), 
    authorization(endpiont.createPost), 
    uploadCloudFile(fileValidations.image).array('attachments', 2),
     validation(validators.updatePost),     
    postService.updatePost
);

router.delete("/:postId", 
    authentication(), 
    authorization(endpiont.freezePost), 
     validation(validators.freezePost),     
    postService.freezePost
);

router.patch("/:postId/restore", 
    authentication(), 
    authorization(endpiont.freezePost), 
     validation(validators.freezePost),     
    postService.unFreezePost
);



router.patch("/:postId/likePost", 
    authentication(), 
    authorization(endpiont.likePost), 
     validation(validators.likePost),     
    postService.likePost,
);






export default router;