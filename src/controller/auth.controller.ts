import { Request, Response, NextFunction } from "express";
import { BCryptExtension, JsonWebTokenExtension } from "src/extension";

import { ROLE_ENUM_TYPE, STATUS_CODE } from "src/enums";
import { CustomError } from "src/model";
import { AuthService } from "src/service";
import { NODE_ENV, REFRESH_JWT_EXPIRATION, REFRESH_JWT_EXPIRATION_IN_MS } from "src/configuration";

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { displayName, email, password, role = "USER_ROLE" } = req.body;

    const authService: AuthService = req.app.locals.authService;

    const emailAlreadyInUse = await authService.findRecord(email);
    if (emailAlreadyInUse) throw new CustomError(STATUS_CODE.BAD_REQUEST, "Email already in use");

    const id: number = await authService.insertRecord({
      Email: email,
      DisplayName: displayName,
      Password: await BCryptExtension.hash(password),
      Role: ROLE_ENUM_TYPE[role as keyof typeof ROLE_ENUM_TYPE],
    });

    return res.status(STATUS_CODE.SUCCESSFULLY).json({ statusCode: STATUS_CODE.SUCCESSFULLY, id });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const authService: AuthService = req.app.locals.authService;

    const user = await authService.findRecord(email);
    if (!user) throw new CustomError(STATUS_CODE.NOT_FOUND, "User not found");

    if (!user.Enabled)
      throw new CustomError(STATUS_CODE.FORBIDDEN, "User blocked, talk with the administrator");

    const isValidPassword = await BCryptExtension.compare(password, user.Password);
    if (!isValidPassword)
      throw new CustomError(STATUS_CODE.BAD_REQUEST, "Email/Password incorrect.");

    const authorization = await JsonWebTokenExtension.generateToken({
      uid: user.Id,
      role: user.Role,
    });

    const refresh = await JsonWebTokenExtension.generateToken(
      { uid: user.Id },
      REFRESH_JWT_EXPIRATION,
    );

    return res
      .status(STATUS_CODE.SUCCESSFULLY)
      .cookie("refresh", refresh, {
        httpOnly: true,
        sameSite: "strict",
        secure: NODE_ENV === "production",
        maxAge: +REFRESH_JWT_EXPIRATION_IN_MS,
      })
      .json({
        statusCode: STATUS_CODE.SUCCESSFULLY,
        refresh,
        idUser: user.Id,
        name: user.Email,
        authorization,
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refresh } = req.cookies;

    const { uid } = JsonWebTokenExtension.verifyToken(refresh);
    if (!uid || +uid <= 0)
      throw new CustomError(STATUS_CODE.BAD_REQUEST, "Refresh token not valid");

    const authorization = await JsonWebTokenExtension.generateToken({ uid });

    return res.status(STATUS_CODE.SUCCESSFULLY).json({
      statusCode: STATUS_CODE.SUCCESSFULLY,
      authorization,
    });
  } catch (error) {
    next(error);
  }
};
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authService: AuthService = req.app.locals.authService;

    const user = await authService.findUserId(req.body.Id);
    if (!user) throw new CustomError(STATUS_CODE.NOT_FOUND, "Event not found.");
    if (req.body.Password) {
      req.body.Password = await BCryptExtension.hash(req.body.Password);
    } else {
      req.body.Password = undefined;
    }
    await authService.update(user.Id, req.body);

    return res.status(STATUS_CODE.SUCCESSFULLY).json({ statusCode: STATUS_CODE.SUCCESSFULLY });
  } catch (error) {
    next(error);
  }
};
export const findUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const authService: AuthService = req.app.locals.authService;

    const user = await authService.findUserId(+id);

    return res
      .status(STATUS_CODE.SUCCESSFULLY)
      .json({ statusCode: STATUS_CODE.SUCCESSFULLY, user });
  } catch (error) {
    next(error);
  }
};
