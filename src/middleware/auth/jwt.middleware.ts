import { Request, Response, NextFunction } from "express";
import { STATUS_CODE } from "src/enums";
import { JsonWebTokenExtension } from "src/extension";
import { CustomError } from "src/model";

export const validateJwt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token: string = JsonWebTokenExtension.getAuthorization(req);
    if (!token) throw new CustomError(STATUS_CODE.UNAUTHORIZED, "Token unexpected.");

    const { uid, role } = JsonWebTokenExtension.verifyToken(token);
    req.uid = uid;
    req.role = role;

    next();
  } catch (error) {
    next(error);
  }
};
