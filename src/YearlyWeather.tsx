import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Temporal } from "@js-temporal/polyfill";
import { memo, useMemo, useState } from "react";
import { generateDailyWeatherForYear } from "./calc/generateDailyWeatherForYear.ts";
import { DataItem } from "./calc/DataItem.ts";

export type DayArgs = {
  plainDate: Temporal.PlainDate;
  baseTemperature: number;
  dailyTemperatureChangeRange: { min: number; max: number };
};

const monthFormatter = new Intl.DateTimeFormat("en", { month: "short" });

const YearlyWeather = ({
  year,
  onDayChange,
}: {
  year: number;
  onDayChange: (args: DayArgs) => void;
}) => {
  const data = useMemo(
    () => {
      const startDate = new Temporal.PlainDate(year, 1, 1); // January 1st of the specified year
      const endDate = startDate.add({ years: 1 }).add({ days: -1 }); // December 31st of the specified year
      const totalDays = endDate.dayOfYear; // Total number of days

      return generateDailyWeatherForYear(totalDays, 12).map((x) => {
        const date = startDate.add({ days: x.day });
        return ({
          ...x,
          date,
          month: date.month,
        });
      });
    },
    [year],
  );

  return (
    <div style={{ width: "600px", height: "300px" }}>
      <LineChart
        width={600}
        height={300}
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        onClick={(x) => {
          const payload = x.activePayload![0].payload as DataItem;
          return onDayChange({
            plainDate: payload.date,
            baseTemperature: payload.value,
            dailyTemperatureChangeRange: { min: -0.25, max: 0.5 },
          });
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
          tickFormatter={(month: number) =>
            monthFormatter.format(new Date(year, month - 1))}
        />
        <YAxis dataKey="value" />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#8884d8"
          dot={false}
        />
      </LineChart>
    </div>
  );
};

export default memo(YearlyWeather);
