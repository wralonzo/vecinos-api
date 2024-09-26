import { DataSource } from "typeorm";
import { Ask, BaseRepository, Valoracion } from "src/database";
import { CustomError } from "src/model";
import { STATUS_CODE } from "src/enums";

export class ValoracionService {
  private readonly _valoracionRepository: BaseRepository<Valoracion>;
  private readonly _askRepository: BaseRepository<Ask>;

  constructor(private readonly _datasource: DataSource) {
    this._valoracionRepository = new BaseRepository(this._datasource, Valoracion);
    this._askRepository = new BaseRepository(this._datasource, Ask);
  }

  public async create(event: Partial<Valoracion>): Promise<number> {
    try {
      const { identifiers } = await this._valoracionRepository.insert(event);
      const { Id } = identifiers[0];

      return !Id || +Id <= 0 ? 0 : Id;
    } catch (error) {
      console.log(error);
      throw new CustomError(STATUS_CODE.INTERNAL_SERVER_ERROR, "Internal server error");
    }
  }

  public async findPaginated(page: number = 1, size: number = 100) {
    try {
      const take = size;
      const skip = (page - 1) * size;

      const data: any = await this._valoracionRepository.findWithPagination(
        {},
        {
          createdAt: "DESC",
        },
        take,
        skip,
        [],
        {
          idUserFk: true,
          askFk: true,
        },
      );

      return data.data;
    } catch (error) {
      throw new CustomError(STATUS_CODE.INTERNAL_SERVER_ERROR, "Internal server error");
    }
  }

  public async findPaginatedASK(page: number = 1, size: number = 100) {
    try {
      const take = size;
      const skip = (page - 1) * size;

      const data = await this._askRepository.findWithPagination(
        {},
        {
          createdAt: "DESC",
        },
        take,
        skip,
        [],
      );

      return data.data;
    } catch (error) {
      throw new CustomError(STATUS_CODE.INTERNAL_SERVER_ERROR, "Internal server error");
    }
  }
}
