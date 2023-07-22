import { Temporal } from "@js-temporal/polyfill";

export type DataItem = {
  date: Temporal.PlainDate;
  day: number;
  value: number;
};
