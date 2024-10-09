import { STATUS_CODE } from "src/enums";
import { deleteFiles, sanitizeForumData } from "src/helpers";
import { Request, Response, NextFunction } from "express";
import { EvidenceService, ForumService, ReplyService } from "src/service";
import { CustomError } from "src/model";
import { MULTER_MAXIMUN_ALLOWED_FILES } from "src/configuration";
import PDFDocument from "pdfkit";

export const createForum = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { uid } = req;
    const { file } = req;
    console.log("console.log(files);", file);
    const { title, description } = req.body;

    const forumService: ForumService = await req.app.locals.forumService;
    const evidenceService: EvidenceService = await req.app.locals.evidenceService;

    const id: number = await forumService.insertRecord({
      AuthorId: +uid,
      Title: title,
      Description: description,
    });

    console.log(file);
    if (file) {
      await evidenceService.insertOne(file.filename, id);
    }

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

export const generateDataPDF = async (req: Request, res: Response, next: NextFunction) => {
  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline; filename=reporte_foros.pdf");
  doc.pipe(res);
  doc.fontSize(20).text("Reporte de Foros", { align: "center" });
  doc.moveDown(2);

  try {
    const forumService: ForumService = await req.app.locals.forumService;
    const usuarios = await forumService.findAll();
    const tableTop = 100;
    const itemHeight = 20;
    doc.fontSize(10);
    doc.text("ID", 50, tableTop);
    doc.text("Titulo", 100, tableTop);
    doc.text("Descripcion", 210, tableTop);
    doc.text("Vecino", 330, tableTop);
    doc.text("Fecha", 415, tableTop);

    doc
      .moveTo(50, tableTop + 15)
      .lineTo(550, tableTop + 15)
      .stroke();
    let position = tableTop + 30;
    usuarios.forEach((foro) => {
      doc.text(foro.Id.toString(), 50, position);
      doc.text(foro.Title, 100, position);
      doc.text(foro.Description, 210, position);
      doc.text(foro.Author.DisplayName, 330, position);
      doc.text(
        foro.CreatedAt ? foro.CreatedAt.toISOString() : new Date().toISOString(),
        415,
        position,
      );
      doc
        .moveTo(50, position + 15)
        .lineTo(550, position + 15)
        .stroke();

      position += itemHeight;
    });

    // Finaliza el documento
    doc.end();
  } catch (error) {
    console.error("Error al generar el reporte:", error);
    res.status(500).send("Error al generar el reporte.");
  }
};
