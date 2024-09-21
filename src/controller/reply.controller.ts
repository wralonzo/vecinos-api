import { CustomError } from "src/model";
import { STATUS_CODE } from "src/enums";
import { ForumService, ReplyService } from "src/service";
import { Request, Response, NextFunction } from "express";
import { deleteFile, sanitizeReplyData } from "src/helpers";

export const createReply = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { file } = req;
    const { uid } = req;
    const { description, forumId, parentReplyId } = req.body;

    const forumService: ForumService = await req.app.locals.forumService;
    const forum = await forumService.findRecordById(+forumId);
    if (!forum) throw new CustomError(STATUS_CODE.NOT_FOUND, "Forum not found.");

    const replyService: ReplyService = await req.app.locals.replyService;
    const id: number = await replyService.insertRecord({
      Author: +uid,
      ForumId: +forum.Id,
      Filename: file?.filename,
      Description: description,
      ParentReply: parentReplyId || parentReplyId >= 1 ? +parentReplyId : undefined,
    });

    return res.status(STATUS_CODE.SUCCESSFULLY).json({ statusCode: STATUS_CODE.SUCCESSFULLY, id });
  } catch (error) {
    next(error);
  }
};

export const updateReply = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { uid } = req;
    const { file } = req;
    const { replyId, description, forumId, fileToRemove } = req.body;

    const forumService: ForumService = await req.app.locals.forumService;
    const forum = await forumService.findRecordById(+forumId);
    if (!forum) throw new CustomError(STATUS_CODE.NOT_FOUND, "Forum not found.");

    if (+uid !== forum?.Author?.Id)
      throw new CustomError(STATUS_CODE.FORBIDDEN, "This is not your reply.");

    const replyService: ReplyService = await req.app.locals.replyService;
    const wasUpdated = await replyService.updateRecord(+replyId, +forumId, {
      UpdatedAt: new Date(),
      Description: description,
      Filename: file?.filename,
    });

    if (wasUpdated && fileToRemove) deleteFile(fileToRemove);

    return res.status(STATUS_CODE.SUCCESSFULLY).json({ statusCode: STATUS_CODE.SUCCESSFULLY });
  } catch (error) {
    next(error);
  }
};

export const getRepliesByForum = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role } = req;
    const { forumId } = req.params;
    const { pageSize = 10, page = 1 } = req.query;

    const forumService: ForumService = await req.app.locals.forumService;
    const forum = await forumService.findRecordById(+forumId);
    if (!forum) throw new CustomError(STATUS_CODE.NOT_FOUND, "Forum not found.");

    const replyService: ReplyService = await req.app.locals.replyService;
    const { data, totalItems, currentPage, totalPages } = await replyService.findRecords(
      +forumId,
      +page,
      +pageSize,
      +role,
    );

    const sanitizedData = data?.map(sanitizeReplyData);

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

export const deleteReply = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { replyId, forumId } = req.body;

    const forumService: ForumService = await req.app.locals.forumService;
    const forum = await forumService.findRecordById(+forumId);
    if (!forum) throw new CustomError(STATUS_CODE.NOT_FOUND, "Forum not found.");

    const replyService: ReplyService = await req.app.locals.replyService;
    const reply = await replyService.findRecordById(+replyId);
    if (!reply) throw new CustomError(STATUS_CODE.NOT_FOUND, "Reply not found.");

    const wasDeleted = await replyService.deleteRecord([reply?.Id]);

    if (wasDeleted && reply?.Filename) {
      deleteFile(reply?.Filename);
    }

    return res.status(STATUS_CODE.SUCCESSFULLY).json({ statusCode: STATUS_CODE.SUCCESSFULLY });
  } catch (error) {
    next(error);
  }
};
