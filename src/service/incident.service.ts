import { DataSource } from "typeorm";
import { CustomError } from "src/model";
import { STATUS_CODE } from "src/enums";
import { BaseRepository, IncidentData } from "src/database";

export class IncidentService {
  private readonly _incidentRepository: BaseRepository<IncidentData>;

  constructor(private readonly _datasource: DataSource) {
    this._incidentRepository = new BaseRepository(this._datasource, IncidentData);
  }

  public async create(incident: Partial<IncidentData>): Promise<number> {
    try {
      const { identifiers } = await this._incidentRepository.insert(incident);
      const { Id } = identifiers[0];

      return !Id || +Id <= 0 ? 0 : Id;
    } catch (error) {
      throw new CustomError(STATUS_CODE.INTERNAL_SERVER_ERROR, "Internal server error");
    }
  }

  public async findOne(id: number): Promise<IncidentData | null> {
    try {
      const incident = await this._incidentRepository.findOne(
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

      return incident;
    } catch (error) {
      throw new CustomError(STATUS_CODE.INTERNAL_SERVER_ERROR, "Internal server error");
    }
  }

  public async update(id: number, incident: Partial<IncidentData>): Promise<boolean> {
    try {
      const data: Partial<IncidentData> = {
        Description: incident?.Description,
      };

      if (incident?.StateId) data.StateId = incident.StateId;

      const { affected } = await this._incidentRepository.update(
        {
          Id: id,
        },
        data,
      );

      return affected && affected >= 1 ? true : false;
    } catch (error) {
      throw new CustomError(STATUS_CODE.INTERNAL_SERVER_ERROR, "Internal server error");
    }
  }

  public async findPaginated(page: number, size: number, author: number | undefined) {
    try {
      const take = size;
      const skip = (page - 1) * size;

      const { data, count } = await this._incidentRepository.findWithPagination(
        {
          AuthorId: !author ? undefined : author,
        },
        {
          CreatedAt: "DESC",
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

  private _santizeRecords(records: Array<Partial<IncidentData>>) {
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
