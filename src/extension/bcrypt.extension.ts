import { genSalt, hash, compare } from "bcrypt";

export class BCryptExtension {
  public static async hash(text: string): Promise<string> {
    const salt = await genSalt();
    return await hash(text, salt);
  }

  public static async compare(textToCompare: string, originalText: string): Promise<boolean> {
    return await compare(textToCompare, originalText);
  }
}
