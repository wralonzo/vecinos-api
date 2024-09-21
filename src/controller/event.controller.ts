import { Request, Response, NextFunction } from "express";
import { ROLE_ENUM_TYPE, STATUS_CODE } from "src/enums";
import { CustomError } from "src/model";
import { EventService } from "src/service";

export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { uid } = req;
    const { title, description, eventAt } = req.body;

    const eventService: EventService = req.app.locals.eventService;
    const id: number = await eventService.create({
      Title: title,
      AuthorId: +uid,
      EventAt: eventAt,
      Description: description,
    });

    return res.status(STATUS_CODE.SUCCESSFULLY).json({ statusCode: STATUS_CODE.SUCCESSFULLY, id });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const findEventById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const eventService: EventService = req.app.locals.eventService;

    const event = await eventService.findOne(+id);
    if (!event) throw new CustomError(STATUS_CODE.NOT_FOUND, "Event not found.");

    return res
      .status(STATUS_CODE.SUCCESSFULLY)
      .json({ statusCode: STATUS_CODE.SUCCESSFULLY, event });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role, uid } = req;
    const { id, description, title, status, eventAt } = req.body;

    const eventService: EventService = req.app.locals.eventService;

    const event = await eventService.findOne(+id);
    if (!event) throw new CustomError(STATUS_CODE.NOT_FOUND, "Event not found.");

    if (event?.AuthorId != +uid || (event?.AuthorId != +uid && role !== ROLE_ENUM_TYPE.ADMIN_ROLE))
      throw new CustomError(STATUS_CODE.FORBIDDEN, "You dont have permission.");

    const wasUpdated = await eventService.update(event.Id, {
      Title: title,
      StateId: status,
      EventAt: eventAt,
      Description: description,
    });

    return res.status(STATUS_CODE.SUCCESSFULLY).json({ statusCode: STATUS_CODE.SUCCESSFULLY });
  } catch (error) {
    next(error);
  }
};

export const findEventsPaginated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pageSize = 10, page = 1 } = req.query;

    const eventService: EventService = req.app.locals.eventService;
    const { data, totalItems, currentPage, totalPages } = await eventService.findPaginated(
      +page,
      +pageSize,
    );

    return res.status(STATUS_CODE.SUCCESSFULLY).json({
      data,
      page: currentPage,
      pages: totalPages,
      count: totalItems,
      statusCode: STATUS_CODE.SUCCESSFULLY,
    });
  } catch (error) {
    next(error);
  }
};
