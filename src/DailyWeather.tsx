import { Temporal } from "@js-temporal/polyfill";
import { useMemo } from "react";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { generateHourlyWeather } from "./calc/generateHourlyWeather.ts";

export function DailyWeather({
  dateTime,
  baseTemperature,
  dailyTemperatureChangeRange,
  rainSequence,
}: {
  dateTime: Temporal.ZonedDateTime;
  baseTemperature: number;
  dailyTemperatureChangeRange: { min: number; max: number };
  rainSequence: { hour: number; strength: number }[];
}) {
  const data = useMemo(
    () =>
      generateHourlyWeather(
        dateTime,
        52.697058,
        11.665210,
        baseTemperature,
        dailyTemperatureChangeRange,
      ).map((x, i) => ({ ...x, rainStrength: rainSequence[i].strength })),
    [dateTime, baseTemperature],
  );
  console.log("data", data);
  return (
    <div>
      <h3>{dateTime.toPlainDate().toString()}</h3>
      <div style={{ width: "1600px", height: "600px" }}>
        <LineChart
          width={1600}
          height={600}
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="hour"
            tick={(props: unknown) => {
              const { x, y, height } = props;
              return (
                <g>
                  <g>
                    <text x={x} y={y + height / 2}>
                      {data[props.payload.value].rainStrength.toFixed(2)}
                    </text>
                  </g>
                </g>
              );
            }}
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
    </div>
  );
}
