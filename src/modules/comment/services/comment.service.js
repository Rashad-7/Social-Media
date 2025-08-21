import { asyncHandler } from "../../../utils/res/error.response.js";
import { successResponse } from "../../../utils/res/success.res.js";
import * as dbServices from "../../../DB/db.service.js";
import postModel from "../../../DB/model/Post.model.js";
import { cloud } from "../../../utils/multer/cloudinary.multer.js";
import commentModel from "../../../DB/model/Comment.model.js";
import { roleTypes } from "../../../DB/model/User.model.js";
export const createComment = asyncHandler(async (req, res, next) => {
  const { postId ,commentId} = req.params;
  if (commentId&&!await dbServices.findOne({model:commentModel,
    filter:{_id:commentId,postId,isDeleted:{$exists:false}}
  })) {
    return next(new Error("in-vaild parent commnet",{cause:404}))
  }
  const post = await dbServices.findOne({
    model: postModel,
    filter: { _id: postId, isDeleted: { $exists: false },commentId:{$exists:false} },
  });

  if (!post) {
    return next(new Error("Post not found or deleted", { cause: 404 }));
  }
  if (!req.files?.length) {
    const attachment = [];
    for (const file of req.files) {
      const { secure_url, public_id } = await cloud.uploader.upload(file.path, {
        folder: `${process.env.APP_NAME}/user/${post.createdBy}/post/${postId}/comment`,
      });
      attachment.push({
        secure_url,
        public_id,
      });
    }
    req.body.attachment = attachment;
  }
  const comment = await dbServices.create({
    model: commentModel,
    data: {
      ...req.body,
      postId,
      commentId,
      createdBy: req.user._id,
    },
  });

  return successResponse({
    res,
    status: 201,
    data: { comment },
    message: "Comment created successfully",
  });
});
export const updateComment = asyncHandler(async (req, res, next) => {
  const { postId, commentId } = req.params;
  const comment = await dbServices.findOne({
    model: commentModel,
    filter: {
      _id: commentId,
      postId,
      createdBy: req.user._id,
      isDeleted: { $exists: false },
    },
    populate: [{ path: "postId" }],
  });

  if (!comment || comment.postId?.isDeleted) {
    return next(new Error("in-vaild comment or deleted post", { cause: 404 }));
  }

  if (!comment || comment.postId.isDeleted) {
    return next(new Error("in-vaild comment or deleted post", { cause: 404 }));
  }
  if (!req.files?.length) {
    const attachment = [];
    for (const file of req.files) {
      const { secure_url, public_id } = await cloud.uploader.upload(file.path, {
        folder: `${process.env.APP_NAME}/user/${post.createdBy}/post/${postId}/comment`,
      });
      attachment.push({
        secure_url,
        public_id,
      });
    }
  }
  const savedComment = await dbServices.findOneAndUpdate({
    model: commentModel,
    filter: {
      _id: commentId,
      postId,
      createdBy: req.user._id,
      isDeleted: { $exists: false },
    },
    data: { ...req.body },
    options: { new: true },
  });
  return successResponse({
    res,
    status: 200,
    data: { savedComment },
    message: "updated succsessfully",
  });
});
export const freezeComment = asyncHandler(async (req, res, next) => {
  const { postId, commentId } = req.params;
  const comment = await dbServices.findOne({
    model: commentModel,
    filter: {
      _id: commentId,
      postId,

      isDeleted: { $exists: false },
    },
    populate: [{ path: "postId" }],
  });

  if (
    !comment ||
    (comment.createdBy.toString() != req.user._id.toString() &&
      comment.postId.createdBy.toString() != req.user._id.toString() &&
      req.user.role != roleTypes.admin)
  ) {
    return next(
      new Error("in-vaild commentId or not authorized user ", { cause: 404 })
    );
  }

  if (!comment || comment.postId.isDeleted) {
    return next(new Error("in-vaild comment or deleted post", { cause: 404 }));
  }

  const savedComment = await dbServices.findOneAndUpdate({
    model: commentModel,
    filter: { _id: commentId, postId, isDeleted: { $exists: false } },
    data: {
      isDeleted: Date.now(),
      deletedBy: req.user._id,
    },
    options: { new: true },
  });
  return successResponse({
    res,
    status: 200,
    data: { savedComment },
    message: "deleted succsessfully",
  });
});
export const unFreezeComment = asyncHandler(async (req, res, next) => {
  const { postId, commentId } = req.params;

  const savedComment = await dbServices.findOneAndUpdate({
    model: commentModel,
    filter: {
  _id: commentId,
  postId,
  deletedBy: req.user._id,
  isDeleted: { $exists: true },
},

    data: {
      $unset: { isDeleted: 0, deletedBy: 0 },
    $set:{  updatedBy: req.user._id,}
    },

    options: { new: true },
  });
  return successResponse({
    res,
    status: 200,
    data: { savedComment },
    message: "restore succsessfully",
  });
});
