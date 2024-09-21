import "dotenv/config";

const PORT = process.env.PORT || "3000";
const NODE_ENV = process.env.NODE_ENV || "development";
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS || "*";

const SECRET_KEY = process.env.SECRET_KEY || "";
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "4h";
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}/`;
const REFRESH_JWT_EXPIRATION = process.env.REFRESH_JWT_EXPIRATION || "7d";
const REFRESH_JWT_EXPIRATION_IN_MS = process.env.REFRESH_JWT_EXPIRATION_IN_MS || "604800000";

export {
  PORT,
  NODE_ENV,
  BASE_URL,
  SECRET_KEY,
  JWT_EXPIRATION,
  ALLOWED_ORIGINS,
  REFRESH_JWT_EXPIRATION,
  REFRESH_JWT_EXPIRATION_IN_MS,
};
