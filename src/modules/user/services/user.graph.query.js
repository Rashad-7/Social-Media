import { authentication } from "../../../middleware/graph/auth.middleware.js"

export const getProfile=async(parent,args)=>{
const{authorization}=args
console.log({args});

const user= await authentication({authorization})
return {message:'Done',statusCode:200,data:user}

}