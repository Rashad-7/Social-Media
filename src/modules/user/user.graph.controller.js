import { GraphQLNonNull, GraphQLString } from "graphql";
import { getProfile } from "./services/user.graph.query.js";
import { getProfileRes } from "./types/user.types.js";

export const query = {
  getProfile: {
    type: getProfileRes,
    args: {
      authorization: { type: new GraphQLNonNull(GraphQLString) },
      
    },
    resolve: getProfile
    
    
  }
  
};
