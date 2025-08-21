import { GraphQLBoolean, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import * as postGraphController from "./post/post.graph.controller.js"
import * as userGraphController from "./user/user.graph.controller.js"
export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "socialApp",
    description: "optional text",
    fields: { 
 ... postGraphController.query,
 ...userGraphController.query
    }
  }),mutation:
new GraphQLObjectType({
  name:"SocialAppMutation",fields:{
    ...postGraphController.mutation
  }
})
});