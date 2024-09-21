import { DataSource } from "typeorm";
import { UserData, BaseRepository } from "src/database";

export class AuthService {
  private readonly _authRepository: BaseRepository<UserData>;

  constructor(private readonly _datasource: DataSource) {
    this._authRepository = new BaseRepository(this._datasource, UserData);
  }

  public async insertRecord(neighborhood: Partial<UserData>): Promise<number> {
    try {
      const { identifiers } = await this._authRepository.insert(neighborhood);
      const { Id } = identifiers[0];

      return !Id || +Id <= 0 ? 0 : Id;
    } catch (error) {
      return 0;
    }
  }

  public async findRecord(email: string): Promise<UserData | null> {
    try {
      const neighborhood: UserData | null = await this._authRepository.findOne({ Email: email });

      return !neighborhood ? null : neighborhood;
    } catch (error) {
      return null;
    }
  }
}
