import { asyncHandler } from "../utils/res/error.response.js";
// import { decodedToken } from "../utils/security/token.security.js";
import { decodedToken } from "../utils/security/token.security.js";
   
export const authentication = () => {
  return asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;
    req.user = await decodedToken({ authorization });
    return next();
  });
};
;

export const authorization=(accessRoles=[])=>{ return asyncHandler(async (req, res, next) => {
if (!accessRoles.includes(req.user.role)) {
  return next(new Error("unauthorized",{cause:403}))
    
}
return next();
})}