import { version } from "package.json";
import {
  FieldException,
  RefreshCookieSchema,
  UnauthorizedException,
  AuthorizationBearerSchema,
  InternalException,
} from "src/documentation";

export const SwaggerOptions = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Neighborhood.Forum.Backend",
      version: version,
      description: "Sistema Vecindario API",
    },
    servers: [],
    components: {
      securitySchemes: {
        RefreshCookieSchema,
        AuthorizationBearerSchema,
      },
      schemas: {},
      responses: {
        FieldException,
        InternalException,
        UnauthorizedException,
      },
    },
  },
  apis: ["**/routes/*.ts"],
};
