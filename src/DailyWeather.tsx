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
import { WeatherBlock } from "./calc/generateHourlyRainForYear.ts";

export function DailyWeather({
  dateTime,
  baseTemperature,
  dailyTemperatureChangeRange,
  rainSequence,
}: {
  dateTime: Temporal.ZonedDateTime;
  baseTemperature: number;
  dailyTemperatureChangeRange: { min: number; max: number };
  rainSequence: ({ hour: number } & WeatherBlock)[];
}) {
  const data = useMemo(
    () =>
      generateHourlyWeather(
        dateTime,
        52.697058,
        11.665210,
        baseTemperature,
        dailyTemperatureChangeRange,
      ).map((x, i) => ({
        ...x,
        rainIntensity: rainSequence[i].rainIntensity,
        cloudDensity: rainSequence[i].cloudDensity,
      })),
    [dateTime, baseTemperature],
  );
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
                    <text fontSize={10} x={x} y={y + height / 2}>
                      {"cl: "}
                      {data[props.payload.value].cloudDensity.toFixed(2)}
                      {"    rn: "}
                      {data[props.payload.value].rainIntensity.toFixed(2)}
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
