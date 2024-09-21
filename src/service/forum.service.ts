import { DataSource } from "typeorm";
import { ForumData, BaseRepository } from "src/database";
import { CustomError } from "src/model";
import { ROLE_ENUM_TYPE, STATUS_CODE } from "src/enums";

export class ForumService {
  private readonly _forumRepository: BaseRepository<ForumData>;

  constructor(private readonly _datasource: DataSource) {
    this._forumRepository = new BaseRepository(this._datasource, ForumData);
  }

  public async insertRecord(forum: Partial<ForumData>): Promise<number> {
    try {
      const { identifiers } = await this._forumRepository.insert(forum);
      const { Id } = identifiers[0];

      return !Id || +Id <= 0 ? 0 : Id;
    } catch (error) {
      throw new CustomError(STATUS_CODE.INTERNAL_SERVER_ERROR, "Internal server error");
    }
  }

  public async updateRecord(id: number, forum: Partial<ForumData>): Promise<boolean> {
    try {
      await this._forumRepository.update({ Id: id }, forum);

      return true;
    } catch (error) {
      throw new CustomError(STATUS_CODE.INTERNAL_SERVER_ERROR, "Internal server error");
    }
  }

  public async deleteRecord(id: number): Promise<boolean> {
    try {
      const wasDisabled = await this._forumRepository.update({ Id: id }, { IsEnabled: false });

      return true;
    } catch (error) {
      throw new CustomError(STATUS_CODE.INTERNAL_SERVER_ERROR, "Internal server error");
    }
  }

  public async findRecords(page: number, size: number, role: number = ROLE_ENUM_TYPE.USER_ROLE) {
    try {
      const skip = (page - 1) * size;
      const take = size;

      const { data, count } = await this._forumRepository.findWithPagination(
        {
          IsEnabled: role === ROLE_ENUM_TYPE.ADMIN_ROLE ? undefined : true,
        },
        {
          CreatedAt: "DESC",
        },
        take,
        skip,
        [],
        {
          Author: true,
          Evidences: true,
        },
      );

      return {
        data: data,
        totalItems: count,
        currentPage: page,
        totalPages: Math.ceil(count / size),
      };
    } catch (error) {
      throw new CustomError(STATUS_CODE.INTERNAL_SERVER_ERROR, "Internal server error");
    }
  }

  public async findRecordById(id: number) {
    try {
      const forum = await this._forumRepository.findOne({ Id: id, IsEnabled: true }, false, [], {
        Evidences: true,
        Author: true,
      });
      return forum;
    } catch (error) {
      throw new CustomError(STATUS_CODE.INTERNAL_SERVER_ERROR, "Internal server error");
    }
  }
}
