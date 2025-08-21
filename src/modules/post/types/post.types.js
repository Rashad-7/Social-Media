import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLID,
  GraphQLSchema,
  GraphQLScalarType,
  GraphQLBoolean
} from "graphql";
import * as dbServices from "../../../DB/db.service.js"
import { oneUserRes } from "../../user/types/user.types.js";
import { imageType } from "../../../utils/app.types.js";
import {userModel} from "../../../DB/model/User.model.js";

export const onePostRes=
          new GraphQLObjectType({
            name: "onePostRes",
            fields: {
              _id: { type: GraphQLID },
              content: { type: GraphQLString },
                
   
              attachments: {
                type: new GraphQLList(imageType)
              },    likes:{type: new GraphQLList(GraphQLID)},
                createdBy: {
      type:GraphQLID
    },   
        updatedBy: {
      type:GraphQLID
    },

    deletedBy: {
      type:GraphQLID
    },
    isDeleted:{type:GraphQLString},
    updatedAt:{type:GraphQLString},
    createdAt:{type:GraphQLString},
    createdByPopulate:{type:oneUserRes

      ,resolve:async(parent,arags)=>{
      console.log({parent});
      const user =await dbServices.findOne({
model:userModel,
filter:{_id:parent.createdBy.toString()}
      })
return user
      }
    }
            }
          })
 
export const postList = new GraphQLObjectType({
  name: "postListRes",
  fields: {
    message: { type: GraphQLString },
    statusCode: { type: GraphQLInt },
    data: { type: new GraphQLList(onePostRes) }
  }
});

export const likePost = new GraphQLObjectType({
  name: "likePost",
  fields: {
    message: { type: GraphQLString },
    statusCode: { type: GraphQLInt },
    data:  { type: new GraphQLList(onePostRes) }
  }
});
