import { OpenAPIV3 } from "openapi-types";

export const PaginationSchema: OpenAPIV3.ParameterObject = {
  in: "query",
  name: "page",
  schema: {
    type: "integer",
    minimum: 1,
  },
};
