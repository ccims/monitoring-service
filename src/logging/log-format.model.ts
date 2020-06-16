import { LogType } from "./log-type";

export interface LogMessageFormat {
  type: LogType;
  time: number;
  source: String;
  target: String;
}