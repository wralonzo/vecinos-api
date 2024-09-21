import { Logform } from "winston";
import { SeqTransportOptions } from "src/types/log";

export type WinstonConfig = {
  logLevel?: string;
  applicationName: string;
  seq?: SeqTransportOptions;
  formats: Array<Logform.Format>;
};
