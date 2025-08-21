import { asyncHandler } from "../../../utils/res/error.response.js";
import { successResponse } from "../../../utils/res/success.res.js";
import * as dbServices from "../../../DB/db.service.js";
import {userModel, roleTypes } from "../../../DB/model/User.model.js";
import { emailEvent } from "../../../utils/event/email.event.js";
import { compareHush } from "../../../utils/security/hush.security.js";
import { cloud } from "../../../utils/multer/cloudinary.multer.js";
import postModel from "../../../DB/model/Post.model.js";
import { FriendRequestModel } from "../../../DB/model/FriendRequset.model.js";
export const profile = asyncHandler(async (req, res, next) => {
  const user = await dbServices.findOne({
    model: userModel,
    filter: { _id: req.user._id },
    populate: [
      {
        path: "friends",
        select: "firstName lastName image",
      },
    ],
  });
  return successResponse({ res, data: { user } });
});
export const shareProfile = asyncHandler(async (req, res, next) => {
  const { profileId } = req.params;
  let user = null;
  if (profileId === req.user._id.toString()) {
    user = req.user;
  } else {
    user = await userModel.findOne({ _id: profileId, isDeleted: {$exists:false} });
    if (!user) {
      return next(new Error("User not found or deleted", { cause: 404 }));
    }
    const viewerIndex = user.viewers.findIndex(
      (v) => v.userId.toString() === req.user._id.toString()
    );
    const now = new Date();
    if (viewerIndex === -1) {
      user.viewers.push({
        userId: req.user._id,
        times: [now],
      });
    } else {
      user.viewers[viewerIndex].times.push(now);
      if (user.viewers[viewerIndex].times.length > 5) {
        user.viewers[viewerIndex].times =
          user.viewers[viewerIndex].times.slice(-5);
      }
    }
    await user.save();
    user = await userModel
      .findById(profileId)
      .select("username email image cover");
  }
  return successResponse({ res, data: { user } });
});
export const updateEmail = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  if (
    await dbServices.findOne({
      model: userModel,
      filter: { email, isDeleted: false },
    })
  ) {
    return next(new Error("Email already exists", { cause: 409 }));
  }

  await dbServices.updateOne({
    model: userModel,
    filter: { _id: req.user._id },
    data: { tempEmail: email },
  });
  emailEvent.emit("updateEmail", {
    id: req.user._id,
    email,
  });
  emailEvent.emit("sendComfirmEmail", {
    id: req.user._id,
    email: req.user.email,
  });
  return successResponse({ res });
});
export const resetEmail = asyncHandler(async (req, res, next) => {
  const { oldCode, newCode } = req.body;
  if (
    !compareHush({
      plainText: oldCode,
      hashValue:
        req.user.confirmEmailOTP ||
        compareHush({ plainText: newCode, hashValue: req.user.tempEmailOTP }),
    })
  ) {
    return next(new Error("In-valid OTP", { cause: 400 }));
  }
  await dbServices.updateOne({
    model: userModel,
    filter: { _id: req.user._id },
    data: {
      $set: {
        email: req.user.tempEmail,
        confirmEmail: true,
        chanageCridentialsTime: Date.now(),
      },
      $unset: { tempEmail: 0, tempEmailOTP: 0 ,confirmEmailOTP:0},
    },
  });
  return successResponse({ res, message: "Email updated successfully" });
});
export const updatePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  if (
    !compareHush({
      plainText: oldPassword,
      hashValue:
        req.user.password
    })
  ) {
    return next(new Error("In-valid old password", { cause: 400 }));
  }
  await dbServices.findOneAndUpdate({
    model: userModel,
    filter: { _id: req.user._id },
    data: {
      $set: {
        password: newPassword,
        chanageCridentialsTime: Date.now(),
      },
    },
  });
  return successResponse({ res, message: "password updated successfully" });
});
export const updateProfile = asyncHandler(async (req, res, next) => {
  const user = await dbServices.findOneAndUpdate({
    model: userModel,
    filter: { _id: req.user._id },
    data:req.body,
    options: { new: true, runValidators: true },
  }); 
  return successResponse({ res, data: { user } });
}); 
export const updateProfileImage = asyncHandler(async (req, res, next) => {
  const {secure_url,public_id}= await cloud.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/user/${req.user._id}/profile`});
  const user = await dbServices.findOneAndUpdate({
    model: userModel,
    filter: { _id: req.user._id },
    data: {image:{secure_url,public_id}},
    options: { new: false},
  });
 
  if (user.image?.public_id) {
    await cloud.uploader.destroy(user.image.public_id); 
   
  }
  return successResponse({ res, data: {user } });
}); 
export const updateProfilecoverImage = asyncHandler(async (req, res, next) => {
 let images=[];
  for (const file of req.files) {
    const { secure_url, public_id } = await cloud.uploader.upload(file.path,{folder:`${process.env.APP_NAME}/user/${req.user._id}/profile/cover`} )
     images.push({secure_url,public_id});
  const user = await dbServices.findOneAndUpdate({
    model: userModel, 
    filter: { _id: req.user._id },
  data: { cover: images }
    ,
    options: { new: true },
  });
  return successResponse({ res, data: {user } });
}});
export const updateProfileIdntity = asyncHandler(async (req, res, next) => {
  // const user = await dbServices.findOneAndUpdate({
  //   model: userModel, 
  //   filter: { _id: req.user._id },
  //   data: {cover: req.files.map(file=>{
  //    return   file.finalPath
  //   }) },
  //   options: { new: true },
  // });
  return successResponse({ res, data: {file:req.files } });
}); 
export const dashboard = asyncHandler(async (req, res, next) => {
const result=await Promise.allSettled([await dbServices.find({
    model: userModel,
    filter: { },
    populate: [
      {
        path: "viewers.userId",
        select: "username image",
      },
    ],
  }),
 await dbServices.find({
    model: postModel,
    filter: { },
  
  })])
  return successResponse({ res, data: { result } });
});
export const chanageRoles = asyncHandler(async (req, res, next) => {
  const {userId}=req.params
  const{role}=req.body;
  const roles=req.user.role===roleTypes.superAdmin?{role:{$nin:[roleTypes.superAdmin]}}:{role:{$nin:[roleTypes.admin,]}}
  const user= await dbServices.findOneAndUpdate({
    model:userModel,
    filter:{
  _id:userId,isDeleted:{$exists:false},...roles

    },
data:{role,updatedBy:req.user._id},
options:{new:true}
  })
  return successResponse({ res, data: { user } });
});
export const sendFriendRequest = asyncHandler(async (req, res, next) => {
const {friendId}=req.params
  const checkUser=await dbServices.findOne({
  model:userModel,
  filter:{
   _id:friendId ,isDeleted:{$exists:false}
  }
})
if (!checkUser) {
  return next(new Error("Not found",{cause:404}))
}
const friendRequest=await dbServices.create({
  model:FriendRequestModel,
data:{friendId,
  createdBy:req.user._id,

}
})
  return successResponse({ res,status:201,data: { friendRequest} });
});
export const responseFriendRequest = asyncHandler(async (req, res, next) => {
  const { friendRequestId } = req.params;
  const friendRequest = await dbServices.findOneAndDelete({
    model: FriendRequestModel,
    filter: {
      _id: friendRequestId,
      status: false,
      friendId: req.user._id
    }
  });
  if (!friendRequest) {
    return next(new Error("Friend request not found or already accepted/rejected", { cause: 404 }));
  }
  await dbServices.updateOne({
    model: userModel,
    filter: { _id: req.user._id },
    data: {
      $addToSet: { friends: friendRequest.createdBy }
    }
  });
  await dbServices.updateOne({
    model: userModel,
    filter: { _id: friendRequest.createdBy },
    data: {
      $addToSet: { friends: req.user._id }
    }
  });

  return successResponse({
    res,
    status: 200,
    message: "Friend request accepted",
    data: {}
  });
});


