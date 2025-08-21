import { Router } from "express";
import * as commentService from "./services/comment.service.js";
import {
  authentication,
  authorization,
} from "../../middleware/auth.middleware.js";
import { endpiont } from "./comment.authoriztion.js";
import {
  fileValidations,
  uploadCloudFile,
} from "../../utils/multer/cloud.multer .js";
import { validation } from "../../middleware/vaildtaion.middleware.js";
import * as validator from "./comment.validation.js";
const router = Router({
  mergeParams: true,
  // strict:true,
  // caseSensitive:true
});
router.post(
  "/:commentId?",
  authentication(),
  authorization(endpiont.create),
  uploadCloudFile(fileValidations.image).array("attachment", 2),
  validation(validator.createComment),
  commentService.createComment
);
router.patch(
  "/:commentId",
  authentication(),
  authorization(endpiont.update),
  uploadCloudFile(fileValidations.image).array("attachment", 2),
  validation(validator.updateComment),
  commentService.updateComment
);
router.delete(
  "/:commentId/freeze",
  authentication(),
  authorization(endpiont.freeze),
  // uploadCloudFile(fileValidations.image).array("attachment", 2),
  validation(validator.freezeComment),
  commentService.freezeComment
);
router.patch(
  "/:commentId/unFreeze",
  authentication(),
  authorization(endpiont.freeze),
  // uploadCloudFile(fileValidations.image).array("attachment", 2),
  validation(validator.freezeComment),
  commentService.unFreezeComment
);
export default router;
