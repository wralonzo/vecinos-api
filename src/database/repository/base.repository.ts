import {
  DataSource,
  Repository,
  EntityTarget,
  UpdateResult,
  InsertResult,
  ObjectLiteral,
  FindOptionsOrder,
  FindOptionsWhere,
  FindOptionsRelations,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

import { PaginationResult } from "src/types/sql";

export class BaseRepository<T extends ObjectLiteral> {
  private readonly _repository: Repository<T>;
  private readonly _entity: EntityTarget<T>;

  constructor(datasource: DataSource, entity: EntityTarget<T>) {
    this._entity = entity;
    this._repository = datasource.getRepository(entity);
  }

  public async findWithPagination(
    where: Array<FindOptionsWhere<T>> | FindOptionsWhere<T> | undefined,
    order: FindOptionsOrder<T>,
    take = 10,
    skip = 0,
    select: string[] = [],
    relations: FindOptionsRelations<T> | undefined = undefined,
  ): Promise<PaginationResult<T>> {
    const [result, total] = await this._repository.findAndCount({
      where,
      order,
      take,
      skip,
      select,
      relations,
    });

    const pageCount = Math.ceil(total / take);

    return {
      data: result,
      count: total,
      pageCount: pageCount,
      currentPage: skip / take + 1,
    };
  }

  async findOne(
    where: Array<FindOptionsWhere<T>> | FindOptionsWhere<T> | undefined,
    cache = false,
    select: string[] = [],
    relations: FindOptionsRelations<T> | undefined = undefined,
  ) {
    const data = await this._repository.findOne({
      where,
      select,
      cache: cache,
      relations,
    });

    return data;
  }

  public async insert(records: QueryDeepPartialEntity<T> | Array<QueryDeepPartialEntity<T>>) {
    const inserted: InsertResult = await this._repository.insert(records);
    return inserted;
  }

  public async update(where: FindOptionsWhere<T>, record: QueryDeepPartialEntity<T>) {
    const updated: UpdateResult = await this._repository.update(where, record);
    return updated;
  }

  public async delete(where: FindOptionsWhere<T>) {
    const deleted = await this._repository.delete(where);
    return deleted;
  }

  public async count(where: FindOptionsWhere<T>) {
    const count = await this._repository.countBy(where);
    return count;
  }

  public async findAll(
    where: Array<FindOptionsWhere<T>> | FindOptionsWhere<T> | undefined,
    order: FindOptionsOrder<T>,
    select: string[] = [],
    relations: FindOptionsRelations<T> | undefined = undefined,
  ): Promise<T[]> {
    return this._repository.find({
      where,
      select,
      order,
      relations,
    });
  }
}
