import multer, { diskStorage, StorageEngine } from "multer";
import {
  MULTER_PARAM,
  MULTER_DIRECTORY,
  MULTER_ALLOWED_FILES,
  MULTER_MAXIMUN_ALLOWED_FILES,
} from "src/configuration";
import { IFile } from "src/interface";

const storage: StorageEngine = diskStorage({
  destination: (_req, _file: IFile, cb) => {
    cb(null, MULTER_DIRECTORY);
  },
  filename: (_req, file: IFile, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const single = multer({
  storage: storage,
  fileFilter: (_req, file: IFile, cb) => {
    if (!MULTER_ALLOWED_FILES.split(",").includes(file.mimetype ?? "")) return cb(null, false);

    cb(null, true);
  },
}).single(MULTER_PARAM);

const array = multer({
  storage: storage,
  fileFilter: (_req, file: IFile, cb) => {
    if (!MULTER_ALLOWED_FILES.split(",").includes(file.mimetype ?? "")) return cb(null, false);

    cb(null, true);
  },
}).array(MULTER_PARAM, +MULTER_MAXIMUN_ALLOWED_FILES);

export { single, array };
