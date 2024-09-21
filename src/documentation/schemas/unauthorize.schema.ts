import { OpenAPIV3 } from "openapi-types";
import { STATUS_CODE } from "src/enums";

export const UnauthorizedException: OpenAPIV3.ResponseObject = {
  description: "Unauthorize",
  content: {
    "application/json": {
      schema: {
        type: "object",
        example: {
          statusCode: STATUS_CODE.UNAUTHORIZED,
          message: "Token unexpected.",
        },
      },
    },
  },
};
