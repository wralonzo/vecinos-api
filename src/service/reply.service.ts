import { DataSource, In } from "typeorm";
import { CustomError } from "src/model";
import { ROLE_ENUM_TYPE, STATUS_CODE } from "src/enums";
import { ReplyData, BaseRepository, UserData } from "src/database";
import EmailService from "./notificationmail.service";

export class ReplyService {
  private readonly _replyRepository: BaseRepository<ReplyData>;
  private readonly userRepository: BaseRepository<UserData>;

  constructor(private readonly _datasource: DataSource) {
    this._replyRepository = new BaseRepository(this._datasource, ReplyData);
    this.userRepository = new BaseRepository(this._datasource, UserData);
  }

  public async insertRecord(reply: Partial<ReplyData>): Promise<number> {
    try {
      const { identifiers } = await this._replyRepository.insert(reply);
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
      await new EmailService().sendMail(
        reply.Description ?? "",
        emailUsers,
        reply.Description ?? "",
      );
      return !Id || +Id <= 0 ? 0 : Id;
    } catch (error) {
      throw new CustomError(STATUS_CODE.INTERNAL_SERVER_ERROR, "Internal server error");
    }
  }

  public async findRecordById(id: number) {
    try {
      const reply = await this._replyRepository.findOne({ Id: id });
      return reply;
    } catch (error) {
      throw new CustomError(STATUS_CODE.INTERNAL_SERVER_ERROR, "Internal server error");
    }
  }

  public async updateRecord(
    id: number,
    forumId: number,
    forum: Partial<ReplyData>,
  ): Promise<boolean> {
    try {
      await this._replyRepository.update({ Id: id, ForumId: forumId }, forum);
      return true;
    } catch (error) {
      throw new CustomError(STATUS_CODE.INTERNAL_SERVER_ERROR, "Internal server error");
    }
  }

  public async findRecords(
    forumId: number,
    page: number,
    size: number,
    role: number = ROLE_ENUM_TYPE.USER_ROLE,
  ) {
    try {
      const skip = (page - 1) * size;
      const take = size;

      const { data, count } = await this._replyRepository.findWithPagination(
        {
          ForumId: forumId,
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
          Forum: true,
        },
      );

      return {
        data: data,
        totalItems: count,
        currentPage: page,
        totalPages: Math.ceil(count / size),
      };
    } catch (error) {
      console.log(error);
      throw new CustomError(STATUS_CODE.INTERNAL_SERVER_ERROR, "Internal server error");
    }
  }

  public async deleteRecord(id: Array<number>): Promise<boolean> {
    try {
      await this._replyRepository.update(
        { Id: In(id) },
        { IsEnabled: false, UpdatedAt: new Date() },
      );
      return true;
    } catch (error) {
      throw new CustomError(STATUS_CODE.INTERNAL_SERVER_ERROR, "Internal server error");
    }
  }

  public async findAll(forumId: number): Promise<Array<ReplyData>> {
    try {
      const records = await this._replyRepository.findAll(
        {
          ForumId: forumId,
        },
        {
          CreatedAt: "ASC",
        },
      );

      return records;
    } catch (error) {
      throw new CustomError(STATUS_CODE.INTERNAL_SERVER_ERROR, "Internal server error");
    }
  }
}
