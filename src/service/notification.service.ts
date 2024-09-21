import { DataSource } from "typeorm";
import { CustomError } from "src/model";
import { STATUS_CODE } from "src/enums";
import { BaseRepository, NotificationData } from "src/database";

export class NotificationService {
  private readonly _notificationRepository: BaseRepository<NotificationData>;

  constructor(private readonly _datasource: DataSource) {
    this._notificationRepository = new BaseRepository(this._datasource, NotificationData);
  }

  public async create(notification: Partial<NotificationData>): Promise<number> {
    try {
      const { identifiers } = await this._notificationRepository.insert(notification);
      const { Id } = identifiers[0];

      return !Id || +Id <= 0 ? 0 : Id;
    } catch (error) {
      throw new CustomError(STATUS_CODE.INTERNAL_SERVER_ERROR, "Internal server error.");
    }
  }

  public async findById(id: number): Promise<NotificationData | null> {
    try {
      const notification = await this._notificationRepository.findOne(
        {
          Id: id,
          Deleted: false,
        },
        false,
        [],
      );

      return notification;
    } catch (error) {
      throw new CustomError(STATUS_CODE.INTERNAL_SERVER_ERROR, "Internal server error.");
    }
  }

  public async update(id: number, notification: Partial<NotificationData>): Promise<boolean> {
    try {
      const { affected } = await this._notificationRepository.update(
        {
          Id: id,
        },
        notification,
      );

      return affected && affected >= 1 ? true : false;
    } catch (error) {
      throw new CustomError(STATUS_CODE.INTERNAL_SERVER_ERROR, "Internal server error.");
    }
  }

  public async findByUser(userId: number) {
    try {
      const records = await this._notificationRepository.findAll(
        {
          UserId: userId,
          Deleted: false,
        },
        {
          CreatedAt: "DESC",
        },
      );

      return this._sanitizedRecords(records);
    } catch (error) {
      throw new CustomError(STATUS_CODE.INTERNAL_SERVER_ERROR, "Internal server error.");
    }
  }

  private _sanitizedRecords(records: Array<NotificationData>) {
    if (!records || !records?.length) return [];

    return records?.map((r) => {
      return {
        ...r,
        User: {
          Id: r?.User?.Id,
          Email: r?.User?.Email,
          DisplayName: r?.User?.DisplayName,
        },
      };
    });
  }
}
