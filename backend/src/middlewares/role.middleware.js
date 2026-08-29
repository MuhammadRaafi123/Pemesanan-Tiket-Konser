import { errorResponse } from "../utils/apiResponse.js";

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(
        res,
        "User belum terautentikasi",
        401
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(
        res,
        "Anda tidak memiliki akses",
        403
      );
    }

    next();
  };
};