import { OpenAPIV3 } from "openapi-types";

export const RefreshCookieSchema: OpenAPIV3.SecuritySchemeObject = {
  in: "cookie",
  type: "apiKey",
  name: "refresh",
};
