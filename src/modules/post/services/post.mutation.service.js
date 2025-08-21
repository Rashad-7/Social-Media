import * as  dbService from "../../../DB/db.service.js"
import postModel from "../../../DB/model/Post.model.js";
import userModel from "../../../DB/model/Post.model.js";
import { authentication } from "../../../middleware/graph/auth.middleware.js";
import { validation } from "../../../middleware/graph/vaildtaion.middleware.js";
import { likePostValidtion } from "../post.validation.js";
export const likePost= async (parent, args) => {
    const{postId,action,authorization}=args
    await validation(likePostValidtion,args)
       const user= await authentication({authorization})
 const data= action== "unLike" ? { $pull: { likes: user._id } } : { $addToSet: { likes: user._id } };

    const posts= await dbService.findOneAndUpdate({
        model:postModel,
        filter:{_id:postId},
        data,
        options:{new:true}
    })
    return {message:"Done",statusCode:200,data:[posts]};
        }