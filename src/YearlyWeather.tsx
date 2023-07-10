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

type DataItem = {
  date: Temporal.PlainDate;
  day: number;
  value: number;
};

function sinusoidThroughoutYear(
  year: number,
  baseTemperature: number,
): DataItem[] {
  const startDate = new Temporal.PlainDate(year, 1, 1); // January 1st of the specified year
  const endDate = new Temporal.PlainDate(year, 12, 31); // December 31st of the specified year
  const totalDays = endDate.dayOfYear; // Total number of days

  const summerPeakOffset = totalDays * 0.3;

  const amplitude = 1; // Adjust the amplitude of the sinusoid as needed
  const frequency = (2 * Math.PI) / totalDays; // Frequency for a yearly cycle (in radians)

  const positiveAmplification = 1.8;

  const data = new Array(totalDays).fill(0).map((_, day) => {
    const angle = frequency * (day - summerPeakOffset);
    let value = amplitude * Math.sin(angle) * baseTemperature;
    if (value > 0) {
      value = value * positiveAmplification;
    }
    return { date: startDate.add({ days: day }), day, value };
  });

  return data;
}

export type DayArgs = {
  plainDate: Temporal.PlainDate;
  baseTemperature: number;
};

const monthFormatter = new Intl.DateTimeFormat("en", { month: "short" });

const YearlyWeather = ({
  onDayChange,
}: {
  onDayChange: (args: DayArgs) => void;
}) => {
  const year = 2023;
  const data = useMemo(
    () =>
      sinusoidThroughoutYear(year, 12).map((x) => ({
        ...x,
        month: x.date.month,
      })),
    [year],
  );

  return (
    <div style={{ width: "600px", height: "300px" }}>
      <LineChart
        width={600}
        height={300}
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        onClick={(x: { activePayload: [{ payload: DataItem }] }) =>
          onDayChange({
            plainDate: x.activePayload[0].payload.date,
            baseTemperature: x.activePayload[0].payload.value,
          })}
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
