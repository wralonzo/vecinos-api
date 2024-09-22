import { DataSource, In } from "typeorm";
import { EvidenceData, BaseRepository } from "src/database";
import { MULTER_MAXIMUN_ALLOWED_FILES } from "src/configuration";
import { CustomError } from "src/model";
import { STATUS_CODE } from "src/enums";

export class EvidenceService {
  private readonly _evidenceRepository: BaseRepository<EvidenceData>;

  constructor(private readonly _datasource: DataSource) {
    this._evidenceRepository = new BaseRepository(this._datasource, EvidenceData);
  }

  public async count(forumId: number): Promise<number> {
    try {
      const count = await this._evidenceRepository.count({
        Forum: forumId,
      });

      return count;
    } catch (error) {
      return 1 + +MULTER_MAXIMUN_ALLOWED_FILES;
    }
  }

  public async insert(fileNames: Array<string>, forumId: number): Promise<boolean> {
    try {
      if (!fileNames || !fileNames?.length) return true;

      const evidenceToInsert: Array<Partial<EvidenceData>> = fileNames?.map((f) => {
        return {
          FileName: f,
          ForumId: forumId,
        };
      });

      const { identifiers } = await this._evidenceRepository.insert(evidenceToInsert);
      return !identifiers || !identifiers?.length ? false : true;
    } catch (error) {
      throw new CustomError(STATUS_CODE.INTERNAL_SERVER_ERROR, "Internal server error");
    }
  }

  public async insertOne(fileNames: string, forumId: number): Promise<boolean> {
    try {
      const { identifiers } = await this._evidenceRepository.insert({
        FileName: fileNames,
        ForumId: forumId,
      });
      return !identifiers || !identifiers?.length ? false : true;
    } catch (error) {
      throw new CustomError(STATUS_CODE.INTERNAL_SERVER_ERROR, "Internal server error");
    }
  }

  public async findMany(forumId: number): Promise<Array<EvidenceData> | null> {
    try {
      const records = await this._evidenceRepository.findAll(
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

  public async remove(fileNames: Array<string>, forumId: number): Promise<boolean> {
    try {
      if (!fileNames || !fileNames?.length) return true;

      const { affected } = await this._evidenceRepository.delete({
        FileName: In(fileNames),
        ForumId: forumId,
      });

      return affected && affected >= 1 ? true : false;
    } catch (error) {
      throw new CustomError(STATUS_CODE.INTERNAL_SERVER_ERROR, "Internal server error");
    }
  }
}
