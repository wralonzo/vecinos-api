import { CustomError } from "src/model";
import { ROLE_ENUM_TYPE, STATUS_CODE } from "src/enums";
import { IncidentService } from "src/service";
import { Request, Response, NextFunction } from "express";

export const createIncident = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { uid } = req;
    const { description } = req.body;

    const incidentService: IncidentService = req.app.locals.incidentService;
    const id: number = await incidentService.create({
      AuthorId: +uid,
      Description: description,
    });

    return res.status(STATUS_CODE.SUCCESSFULLY).json({ statusCode: STATUS_CODE.SUCCESSFULLY, id });
  } catch (error) {
    next(error);
  }
};

export const updateIncident = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { uid, role } = req;
    const { id, description, status } = req.body;

    const incidentService: IncidentService = req.app.locals.incidentService;

    const incident = await incidentService.findOne(id);
    if (!incident) throw new CustomError(STATUS_CODE.NOT_FOUND, "Incident not found.");

    if (incident?.AuthorId !== +uid || role !== ROLE_ENUM_TYPE.ADMIN_ROLE)
      throw new CustomError(STATUS_CODE.FORBIDDEN, "You dont have permission.");

    await incidentService.update(incident.Id, {
      Description: description,
      StateId: status,
    });

    return res.status(STATUS_CODE.SUCCESSFULLY).json({ statusCode: STATUS_CODE.SUCCESSFULLY });
  } catch (error) {
    next(error);
  }
};

export const findIncidentsPaginated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pageSize = 10, page = 1, author } = req.query;

    const incidentService: IncidentService = req.app.locals.incidentService;
    const { data, totalItems, currentPage, totalPages } = await incidentService.findPaginated(
      +page,
      +pageSize,
      +author!,
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
