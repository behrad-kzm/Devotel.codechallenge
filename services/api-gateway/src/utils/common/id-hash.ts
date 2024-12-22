import {createHash} from "crypto";

export class IdHash {
  static makeHash(keys: string[], secret: string): string {
      const text = secret + keys.reduce((previous, current) => {
          return previous + current;
      });
      return createHash("md5").update(text).digest("hex");
  }
}
