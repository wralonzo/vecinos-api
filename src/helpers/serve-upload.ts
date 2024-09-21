import { unlink } from "fs";
import { join, resolve } from "path";
import { ForumData, ReplyData } from "src/database";
import { BASE_URL, MULTER_DIRECTORY } from "src/configuration";

const serveUploadUrl = (filename: string): string | null => {
  if (!filename) return null;

  return `${BASE_URL}uploads/${filename}`;
};

export const sanitizeForumData = (forum: ForumData) => ({
  ...forum,
  Author: {
    Id: forum?.Author?.Id,
    Email: forum?.Author?.Email,
    DisplayName: forum?.Author?.DisplayName,
  },
  Evidences: forum.Evidences?.map((evidence: any) => ({
    CreatedAt: evidence?.CreatedAt,
    FileName: serveUploadUrl(evidence?.FileName),
  })),
});

export const sanitizeReplyData = (reply: ReplyData) => ({
  ...reply,
  Filename: serveUploadUrl(reply?.Filename!),
});

export const deleteFiles = (filenames: Array<string>) => {
  try {
    const path = resolve(MULTER_DIRECTORY);

    filenames?.forEach((f) => {
      if (!f) return;

      const filePath = join(path, f);

      unlink(filePath, (err) => {
        if (err) console.error(`[ERROR][FILE][PHYSICAL] - ${f}:`, err);
      });
    });
  } catch (error) {
    console.error(`[ERROR][FILE][PHYSICAL] `, error);
  }
};

export const deleteFile = (filename: string) => {
  try {
    const path = resolve(MULTER_DIRECTORY, filename);

    unlink(path, (err) => {
      if (err) console.error(`[ERROR][FILE][PHYSICAL] - ${filename}:`, err);
    });
  } catch (error) {
    console.error(`[ERROR][FILE][PHYSICAL] `, error);
  }
};
