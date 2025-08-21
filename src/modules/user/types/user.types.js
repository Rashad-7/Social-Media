import { GraphQLBoolean, GraphQLEnumType, GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLScalarType, GraphQLString } from "graphql";
import { imageType } from "../../../utils/app.types.js";
import { roleTypes } from "../../../DB/model/User.model.js";

export const oneUserType= new GraphQLObjectType({
    name:"oneUserType",
    fields:{
        _id:{type:GraphQLID},
        firstName:{type:GraphQLString},
        lastName:{type:GraphQLString},
        email:{type:GraphQLString},
        password:{type:GraphQLString},
        image:{type:imageType},
        confirmEmailOTP:{type:GraphQLString}, 
     tPasswordOTP:{type:GraphQLString},
        phone:{type:GraphQLString},
        address:{type:GraphQLString},
        DOB:{type:GraphQLString},
        cover:{type:new GraphQLList(imageType)},
        gender:{
        type:new GraphQLEnumType({
            name:"genderType",
            values:{
                male:{type:GraphQLString},
                female:{type:GraphQLString},
            }
        })
        },
        role:{
        type:new GraphQLEnumType({
            name:"roleType",
            values:{
                admin:{type:GraphQLString},
                user:{type:GraphQLString},
                superAdmin:{type:GraphQLString},

            }
        })
        },
            confirmEmail:{type: GraphQLBoolean},
            isDeleted: {
              type: GraphQLString
            }
            ,
            chanageCridentialsTime:{type:GraphQLString},
            confirmEmailOTPExpires:{type:GraphQLString},
           provider:{
        type:new GraphQLEnumType({
            name:"providerType",
            values:{
                system:{type:GraphQLString},
                google:{type:GraphQLString},
            }
        })
        },
         tempEmail:{type:GraphQLString},
        tempEmailOTP:{type:GraphQLString},


    }
})
export const oneUserRes= new GraphQLObjectType({
    name:"oneUserRes",
    fields:{
     ...oneUserType.toConfig().fields,
        viewers:{type:new GraphQLList(new GraphQLObjectType({
            name:"viewersList",
            fields:{ ...oneUserType.toConfig().fields}
        }))},
        updatedBy:{type:GraphQLID}
    }
})
export const getProfileRes= new GraphQLObjectType({
    name:"getProfile",
    fields:{
    message:{type:GraphQLString},
    statusCode:{type:GraphQLInt},
    data:{type:oneUserRes}
    
    }
})