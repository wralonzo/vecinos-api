import { DataSource } from "typeorm";
import { BaseRepository, EventData } from "src/database";
import { CustomError } from "src/model";
import { STATUS_CODE } from "src/enums";

export class EventService {
  private readonly _eventRepository: BaseRepository<EventData>;

  constructor(private readonly _datasource: DataSource) {
    this._eventRepository = new BaseRepository(this._datasource, EventData);
  }

  public async create(event: Partial<EventData>): Promise<number> {
    try {
      const { identifiers } = await this._eventRepository.insert(event);
      const { Id } = identifiers[0];

      return !Id || +Id <= 0 ? 0 : Id;
    } catch (error) {
      throw new CustomError(STATUS_CODE.INTERNAL_SERVER_ERROR, "Internal server error");
    }
  }

  public async findOne(id: number): Promise<EventData | null> {
    try {
      const event = await this._eventRepository.findOne(
        {
          Id: id,
        },
        false,
        [],
        {
          Author: true,
          Status: true,
        },
      );

      return this._santizeRecord(event);
    } catch (error) {
      throw new CustomError(STATUS_CODE.INTERNAL_SERVER_ERROR, "Internal server error");
    }
  }

  public async update(id: number, event: Partial<EventData>): Promise<boolean> {
    try {
      const { affected } = await this._eventRepository.update(
        {
          Id: id,
        },
        event,
      );

      return affected && affected >= 1 ? true : false;
    } catch (error) {
      throw new CustomError(STATUS_CODE.INTERNAL_SERVER_ERROR, "Internal server error");
    }
  }

  public async findPaginated(page: number, size: number) {
    try {
      const take = size;
      const skip = (page - 1) * size;

      const { data, count } = await this._eventRepository.findWithPagination(
        {},
        {
          EventAt: "DESC",
        },
        take,
        skip,
        [],
        {
          Author: true,
          Status: true,
        },
      );

      return {
        data: this._santizeRecords(data),
        totalItems: count,
        currentPage: page,
        totalPages: Math.ceil(count / size),
      };
    } catch (error) {
      throw new CustomError(STATUS_CODE.INTERNAL_SERVER_ERROR, "Internal server error");
    }
  }

  private _santizeRecord(record: EventData | null): EventData | null {
    if (!record) return null;

    return {
      ...record,
      Author: {
        ...record?.Author,
        Password: "",
      },
    };
  }

  private _santizeRecords(records: Array<Partial<EventData>>) {
    if (!records || !records?.length) return [];

    return records?.map((r) => {
      return {
        ...r,
        Author: {
          Id: r?.Author?.Id,
          Email: r?.Author?.Email,
          DisplayName: r?.Author?.DisplayName,
        },
        Status: {
          Id: r?.Status?.Id,
          Description: r?.Status?.Description,
        },
      };
    });
  }
}
