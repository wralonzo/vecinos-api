import { Request } from "express";
import { sign, verify } from "jsonwebtoken";

import { STATUS_CODE } from "src/enums";
import { CustomError } from "src/model";
import { JWT_EXPIRATION, SECRET_KEY } from "src/configuration";
import { IJsonWebToken } from "src/interface";

export class JsonWebTokenExtension {
  private static _secret: string = SECRET_KEY;

  public static generateToken(
    payload: object,
    expiration: string = JWT_EXPIRATION,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      sign(
        payload,
        this._secret,
        {
          expiresIn: expiration,
        },
        (err: Error | null, token: string | undefined) => {
          if (err || !token)
            return reject(
              new CustomError(STATUS_CODE.INTERNAL_SERVER_ERROR, "Internal server error"),
            );

          resolve(token);
        },
      );
    });
  }

  public static verifyToken(token: string): IJsonWebToken {
    try {
      return verify(token, this._secret) as IJsonWebToken;
    } catch (error) {
      throw new CustomError(STATUS_CODE.FORBIDDEN, "Token not valid.");
    }
  }

  public static getAuthorization(req: Request): string {
    const header = req.headers["authorization"];
    if (!header) throw new CustomError(STATUS_CODE.UNAUTHORIZED, "Token unexpected.");

    const bearer = header?.split(" ");
    const token = bearer[1] ?? "";

    return token;
  }
}
