import { OpenAPIV3 } from "openapi-types";
import { STATUS_CODE } from "src/enums";

export const InternalException: OpenAPIV3.ResponseObject = {
  description: "Internal server error",
  content: {
    "application/json": {
      schema: {
        type: "object",
        example: {
          statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: "Internal server error",
        },
      },
    },
  },
};
