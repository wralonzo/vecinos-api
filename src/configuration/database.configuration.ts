import "dotenv/config";

// SQL
const MYSQL_USER = process.env.MYSQL_USER || "";
const MYSQL_PORT = process.env.MYSQL_PORT || 5432;
const MYSQL_CACHE = process.env.MYSQL_CACHE || false;
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || "";
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || "";
const MYSQL_LOGGING = process.env.MYSQL_LOGGING || false;
const MYSQL_HOST = process.env.MYSQL_HOST || "localhost";

const MYSQL_SEED = process.env.MYSQL_SEED || false;

export {
  MYSQL_SEED,
  MYSQL_USER,
  MYSQL_PORT,
  MYSQL_HOST,
  MYSQL_CACHE,
  MYSQL_LOGGING,
  MYSQL_DATABASE,
  MYSQL_PASSWORD,
};
