import { roleTypes } from "../../DB/model/User.model.js";

export  const endpiont = {
    createPost: [roleTypes.user,roleTypes.superAdmin,roleTypes.user],
    freezePost: [roleTypes.admin, roleTypes.user],
    likePost: [roleTypes.user,roleTypes.admin],
    unLikePost: [roleTypes.user,   roleTypes.admin],
         
}