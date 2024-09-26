import { STATUS_CODE } from "src/enums";
import { Request, Response, NextFunction } from "express";
import { ValoracionService } from "src/service/valoracion.service";
import { Valoracion } from "src/database";

export const createValoracion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: Valoracion = req.body;

    const insertService: ValoracionService = await req.app.locals.insertService;
    const id: number = await insertService.create(data);

    return res.status(STATUS_CODE.SUCCESSFULLY).json({ statusCode: STATUS_CODE.SUCCESSFULLY, id });
  } catch (error) {
    next(error);
  }
};

export const getAks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const insertService: ValoracionService = await req.app.locals.insertService;
    const data = await insertService.findPaginatedASK();
    return res.status(STATUS_CODE.SUCCESSFULLY).json(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getValoraciones = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const insertService: ValoracionService = await req.app.locals.insertService;
    const data = await insertService.findPaginated();
    return res.status(STATUS_CODE.SUCCESSFULLY).json(data);
  } catch (error) {
    next(error);
  }
};
