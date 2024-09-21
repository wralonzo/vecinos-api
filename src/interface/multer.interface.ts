import { Request } from "express";
import { FileFilterCallback } from "multer";

export interface IFile {
  fieldname?: string;
  originalname?: string;
  encoding?: string;
  mimetype?: string;
}

export interface MFilter {
  (req: Request, file: IFile, callback: FileFilterCallback): void | undefined;
}
