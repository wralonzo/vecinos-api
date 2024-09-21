import { CustomError } from "src/model";
import { STATUS_CODE } from "src/enums";
import { NotificationService } from "src/service";
import { Request, Response, NextFunction } from "express";

export const createNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { message, user } = req.body;

    const notificationService: NotificationService = req.app.locals.notificationService;
    const id: number = await notificationService.create({
      UserId: user,
      Message: message,
    });

    return res.status(STATUS_CODE.SUCCESSFULLY).json({ statusCode: STATUS_CODE.SUCCESSFULLY, id });
  } catch (error) {
    next(error);
  }
};

export const updateNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { uid } = req;
    const { id, viewed, deleted } = req.body;

    const notificationService: NotificationService = req.app.locals.notificationService;

    const notification = await notificationService.findById(id);
    if (!notification) throw new CustomError(STATUS_CODE.NOT_FOUND, "Notification not found.");

    if (notification.UserId != +uid)
      throw new CustomError(STATUS_CODE.FORBIDDEN, "You dont have permission.");

    const wasUpdated: boolean = await notificationService.update(notification.Id, {
      Viewed: viewed,
      Deleted: deleted,
    });

    return res.status(STATUS_CODE.SUCCESSFULLY).json({ statusCode: STATUS_CODE.SUCCESSFULLY });
  } catch (error) {
    next(error);
  }
};

export const findNotificationsByUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { uid } = req;

    const notificationService: NotificationService = req.app.locals.notificationService;
    const notifications = await notificationService.findByUser(+uid);

    return res
      .status(STATUS_CODE.SUCCESSFULLY)
      .json({ statusCode: STATUS_CODE.SUCCESSFULLY, notifications });
  } catch (error) {
    next(error);
  }
};
