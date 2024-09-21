import { STATUS_CODE } from "src/enums";
import { deleteFiles, sanitizeForumData } from "src/helpers";
import { Request, Response, NextFunction } from "express";
import { EvidenceService, ForumService, ReplyService } from "src/service";
import { CustomError } from "src/model";
import { MULTER_MAXIMUN_ALLOWED_FILES } from "src/configuration";

export const createForum = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { uid } = req;
    const { files } = req;
    const { title, description } = req.body;

    const forumService: ForumService = await req.app.locals.forumService;
    const evidenceService: EvidenceService = await req.app.locals.evidenceService;

    const id: number = await forumService.insertRecord({
      AuthorId: +uid,
      Title: title,
      Description: description,
    });

    const fileNames: Array<string> =
      (files as Express.Multer.File[])?.map((f) => f?.filename) || [];
    await evidenceService.insert(fileNames, id);

    return res.status(STATUS_CODE.SUCCESSFULLY).json({ statusCode: STATUS_CODE.SUCCESSFULLY, id });
  } catch (error) {
    next(error);
  }
};

export const updateForum = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { files } = req;
    const { title, description, id, imagesToRemove } = req.body;

    const forumService: ForumService = await req.app.locals.forumService;
    const evidenceService: EvidenceService = await req.app.locals.evidenceService;

    const forum = await forumService.findRecordById(+id);
    if (!forum) throw new CustomError(STATUS_CODE.NOT_FOUND, "Forum not found");

    const santized: Array<string> = imagesToRemove ? imagesToRemove?.split(",") : [];
    let existingImages = forum.Evidences;

    if (santized && santized?.length > 0) {
      const imagesToKeep = existingImages?.filter((image) => !santized.includes(image.FileName));
      existingImages = imagesToKeep;

      await evidenceService.remove(santized, forum.Id);

      // PHYSICAL REMOVE
      deleteFiles(santized);
    }

    const newImagesCount = files ? files?.length : 0;
    const totalImagesCount = existingImages?.length! + +newImagesCount;

    if (totalImagesCount > +MULTER_MAXIMUN_ALLOWED_FILES)
      throw new CustomError(
        STATUS_CODE.BAD_REQUEST,
        `You can only have a maximum of ${+MULTER_MAXIMUN_ALLOWED_FILES} images. You currently have ${existingImages?.length} images.`,
      );

    const wasUpdated: boolean = await forumService.updateRecord(forum.Id, {
      Title: title,
      UpdatedAt: new Date(),
      Description: description,
    });

    if (files && +files?.length > 0) {
      const fileNames: Array<string> =
        (files as Express.Multer.File[])?.map((f) => f?.filename) || [];

      const newFilesToInsert = fileNames.filter(
        (fileName) => !existingImages?.some((img) => img.FileName === fileName),
      );

      if (newFilesToInsert.length > 0) await evidenceService.insert(newFilesToInsert, forum.Id);
    }

    return res.status(STATUS_CODE.SUCCESSFULLY).json({ statusCode: STATUS_CODE.SUCCESSFULLY });
  } catch (error) {
    next(error);
  }
};

export const deleteForum = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.body;

    const forumService: ForumService = await req.app.locals.forumService;
    const replyService: ReplyService = await req.app.locals.replyService;
    const evidenceService: EvidenceService = await req.app.locals.evidenceService;

    const forum = await forumService.findRecordById(+id);
    if (!forum) throw new CustomError(STATUS_CODE.NOT_FOUND, "Forum not found");

    const wasDeleted = await forumService.deleteRecord(+id);
    if (wasDeleted) {
      const sanitizedEvidence = forum?.Evidences?.map((e) => e.FileName);

      if (sanitizedEvidence) {
        deleteFiles(sanitizedEvidence);
        await evidenceService.remove(sanitizedEvidence, forum?.Id);
      }

      const replies = await replyService.findAll(forum.Id);
      const sanitizedReplyIds: Array<number> = replies?.map((r) => r.Id);
      const sanitizedReplies: Array<string> = replies?.map((r) => r?.Filename!);

      if (sanitizedReplies) {
        deleteFiles(sanitizedReplies);
        await replyService.deleteRecord(sanitizedReplyIds);
      }
    }

    return res.status(STATUS_CODE.SUCCESSFULLY).json({ statusCode: STATUS_CODE.SUCCESSFULLY });
  } catch (error) {
    next(error);
  }
};

export const getForums = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role } = req;
    const { pageSize = 10, page = 1 } = req.query;

    const forumService: ForumService = await req.app.locals.forumService;
    const { data, totalItems, currentPage, totalPages } = await forumService.findRecords(
      +page,
      +pageSize,
      +role,
    );

    const sanitizedData = data?.map(sanitizeForumData);

    return res.status(STATUS_CODE.SUCCESSFULLY).json({
      data: sanitizedData,
      page: currentPage,
      pages: totalPages,
      count: totalItems,
      statusCode: STATUS_CODE.SUCCESSFULLY,
    });
  } catch (error) {
    next(error);
  }
};
