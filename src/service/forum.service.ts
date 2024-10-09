import { DataSource } from "typeorm";
import { ForumData, BaseRepository, UserData } from "src/database";
import { CustomError } from "src/model";
import { ROLE_ENUM_TYPE, STATUS_CODE } from "src/enums";
import EmailService from "./notificationmail.service";

export class ForumService {
  private readonly _forumRepository: BaseRepository<ForumData>;
  private readonly userRepository: BaseRepository<UserData>;

  constructor(private readonly _datasource: DataSource) {
    this.userRepository = new BaseRepository(this._datasource, UserData);
    this._forumRepository = new BaseRepository(this._datasource, ForumData);
  }

  public async insertRecord(forum: Partial<ForumData>): Promise<number> {
    try {
      const { identifiers } = await this._forumRepository.insert(forum);
      const { Id } = identifiers[0];
      const dataUser = await this.userRepository.findAll(
        {},
        {
          CreatedAt: "DESC",
        },
      );
      const emailUsers = dataUser.map((item) => {
        return item.Email;
      });
      await new EmailService().sendMail(forum.Title ?? "", emailUsers, forum.Description ?? "");
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

  public async findAll(): Promise<ForumData[] | []> {
    try {
      const data = await this._forumRepository.findAll(
        {},
        {
          CreatedAt: "ASC",
        },
        [],
        {
          Author: true,
        },
      );

      return !data ? [] : data;
    } catch (error) {
      return [];
    }
  }
}
