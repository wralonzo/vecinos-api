import { Request, Response, NextFunction } from "express";
import { ROLE_ENUM_TYPE, STATUS_CODE } from "src/enums";
import { CustomError } from "src/model";

export const accessMiddleware = (roles: Array<number> = [ROLE_ENUM_TYPE.ADMIN_ROLE]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { role } = req;

    if (!role) throw new CustomError(STATUS_CODE.BAD_REQUEST, "Role not valid");

    if (!roles.includes(role)) throw new CustomError(STATUS_CODE.FORBIDDEN, "Forbidden");

    next();
  };
};
