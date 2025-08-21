import { asyncHandler } from "../../../utils/res/error.response.js";
import * as dbServices from "../../../DB/db.service.js";
import postModel from "../../../DB/model/Post.model.js";
import { successResponse } from "../../../utils/res/success.res.js";
import { cloud } from "../../../utils/multer/cloudinary.multer.js";
import { roleTypes } from "../../../DB/model/User.model.js";
import commentModel from "../../../DB/model/Comment.model.js";
import { paginate } from "../../../utils/pagination.js";
export const createPost= asyncHandler(async (req, res, next) => {
  const { content } = req.body;
  let attachments = [];
for (const file of req.files) {
    const{secure_url,public_id}=await cloud.uploader.upload(file.path,{  folder:`${process.env.APP_NAME}/post/${req.user._id}`});
attachments.push({ secure_url, public_id });}
  const post = await dbServices.create({
    model: postModel,
    data: {
      content,
      attachments,
      createdBy: req.user._id
    }   
  }); 
  return successResponse({ res, status:201,data: { post }, });
});
export const updatePost = asyncHandler(async (req, res, next) => {
 let attachments = [];
 if (req.files.length) {
     for (const file of req.files) { 
    const { secure_url, public_id } = await cloud.uploader.upload(file.path, { folder: `${process.env.APP_NAME}/post/${req.user._id}` });
    attachments.push({ secure_url, public_id });
 }
req.body.attachments = attachments;
  }
  const post = await dbServices.findOneAndUpdate({
    model: postModel,
    filter: { _id: req.params.postId , createdBy: req.user._id, isDelete: { $exists: false } },
    data: {
    ...req.body,
      updatedBy: req.user._id
    },
    options: { new: true, runValidators: true }
  });
  console.log({
  postId: req.params.postId,
  userId: req.user._id,
});

  return post? successResponse({ res,status:200, data: { post } }):next(new Error("not found post",{cause:404}));
})
export const freezePost = asyncHandler(async (req, res, next) => {
 const owner = req.user.role===roleTypes.admin? {}: { createdBy: req.user._id };
  const post = await dbServices.findOneAndUpdate({
    model: postModel,
    filter: { _id: req.params.postId , ...owner, isDelete: { $exists: false } },
    data: {
    isDelete:true,
      updatedBy: req.user._id,
      deletedBy:req.user._id
    },
    options: { new: true, runValidators: true }
  });
  console.log({
  postId: req.params.postId,
  userId: req.user._id,
});

  return post? successResponse({ res,status:200, data: { post } }):next(new Error("not found post",{cause:404}));
})
export const unFreezePost = asyncHandler(async (req, res, next) => {

  const post = await dbServices.findOneAndUpdate({
    model: postModel,
    filter: { _id: req.params.postId , deletedBy:req.user._id, isDelete: { $exists: true } },
    data: {
   $unset:{ isDelete:0,
      deletedBy:0
    },
updatedBy: req.user._id
},     
    options: { new: true, runValidators: true }
  });
    return post? successResponse({ res,status:200, data: { post } }):next(new Error("not found post",{cause:404}));
})

export const likePost = asyncHandler(async (req, res, next) => {
 const data= req.query.action== "unLike" ? { $pull: { likes: req.user._id } } : { $addToSet: { likes: req.user._id } };

  const post = await dbServices.findOneAndUpdate({
    model: postModel,
    filter: { _id: req.params.postId , isDelete: { $exists: false } },
    data,
    options: { new: true, runValidators: true }
  });


  return post? successResponse({ res,status:200, data: { post } }):next(new Error("not found post",{cause:404}));
})

export const getAllPosts = asyncHandler(async (req, res, next) => {

 let{page,size}=req.query
 const data=await paginate({page,size, model: postModel,
    filter: { isDeleted: { $exists: false } },
    populate: [
      {
        path: "comments",
        match: { isDeleted: { $exists: false } },
        populate: {
          path: "replay",
          match: { isDeleted: { $exists: false } }
        }
      }
    ],})

  return successResponse({
    res,
    status: 200,
    data: { data }
  });
});
