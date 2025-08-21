import { GraphQLEnumType, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLScalarType, GraphQLSchema, GraphQLString } from "graphql";
import * as queryServices from "./services/post.query.service.js"
import * as mutationServices from "./services/post.mutation.service.js"
import * as postType from "./types/post.types.js";
import { likePost } from "./services/post.mutation.service.js";
export const query ={    postList: {
       type: postType.postList,
      resolve:queryServices.postList
      },}
      export const mutation={
       likePost:{
              type:postType.likePost,
              args:{
                     postId:{type:new GraphQLNonNull(GraphQLID)},
                     action:{type:new GraphQLNonNull(new GraphQLEnumType({
                   name:"action",
                   values:
                   {
                     like:{type :GraphQLString},
                     unLike:{type :GraphQLString}

                   }
                     }))},

                     authorization:{type:new GraphQLNonNull(GraphQLString)}
              }
              ,
              resolve:mutationServices.likePost
       }
      }