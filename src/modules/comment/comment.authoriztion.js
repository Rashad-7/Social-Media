import { roleTypes } from "../../DB/model/User.model.js";

 export const endpiont = {
    create:[ roleTypes.user],
    update :[ roleTypes.user],
    freeze :[ roleTypes.user,roleTypes.admin],
   }