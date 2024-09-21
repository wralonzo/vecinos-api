import "dotenv/config";

const MULTER_PARAM = process.env.MULTER_PARAM || "evidence";
const MULTER_DIRECTORY = process.env.MULTER_DIRECTORY || "data";
const MULTER_ALLOWED_FILES = process.env.MULTER_ALLOWED_FILES || "application/pdf";
const MULTER_MAXIMUN_ALLOWED_FILES = process.env.MULTER_MAXIMUN_ALLOWED_FILES || "3";

export { MULTER_PARAM, MULTER_DIRECTORY, MULTER_ALLOWED_FILES, MULTER_MAXIMUN_ALLOWED_FILES };
