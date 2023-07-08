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
import { memo, useState } from "react";

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

  const midJulyDay = Math.ceil(totalDays / 2); // Day number of mid-July

  const amplitude = 1; // Adjust the amplitude of the sinusoid as needed
  const frequency = (2 * Math.PI) / 365; // Frequency for a yearly cycle (in radians)

  const data = new Array(totalDays).fill(0).map((_, day) => {
    const angle = frequency * (day - midJulyDay);
    const value = amplitude * Math.sin(angle) * baseTemperature;

    return { date: startDate.add({ days: day }), day, value };
  });

  return data;
}

export type DayArgs = {
  dateTime: Temporal.ZonedDateTime;
  baseTemperature: number;
};

const YearlyWeather = ({
  onDayChange,
}: {
  onDayChange: (args: DayArgs) => void;
}) => {
  const year = 2023;
  const [data] = useState(() => sinusoidThroughoutYear(year, 12));

  return (
    <div style={{ width: "600px", height: "300px" }}>
      <LineChart
        width={600}
        height={300}
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        onClick={(x: { activePayload: [{ payload: DataItem }] }) =>
          onDayChange({
            dateTime: x.activePayload[0].payload.date
              .toZonedDateTime({ timeZone: "utc" }),
            baseTemperature: x.activePayload[0].payload.value,
          })}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis dataKey="value" />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="value"
          name="Flattened Sinusoid"
          stroke="#8884d8"
          dot={false}
        />
      </LineChart>
    </div>
  );
};

export default memo(YearlyWeather);
