import { Temporal } from "@js-temporal/polyfill";
import { useMemo } from "react";
import SunCalc from "suncalc";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function getHourlyWeather(
  dateTime: Temporal.ZonedDateTime,
  latitude: number,
  longitude: number,
  baseTemperature: number,
  dailyTemperatureChangeRange: { min: number; max: number },
) {
  const startOfDay = dateTime;

  return new Array(24).fill(0).map((_, hour) => {
    const offsetDateTime = startOfDay.add({ hours: hour - 1 }); // to offset temperature change that takes an hour to have an effect
    const { altitude } = SunCalc.getPosition(
      new Date(offsetDateTime.epochMilliseconds),
      latitude,
      longitude,
    );

    const temperatureShift = altitude *
      (altitude > 0
        ? dailyTemperatureChangeRange.max
        : -dailyTemperatureChangeRange.min);

    return {
      hour,
      value: baseTemperature * (1 + temperatureShift),
    };
  });
}

export function DailyWeather({
  dateTime,
  baseTemperature,
  dailyTemperatureChangeRange,
}: {
  dateTime: Temporal.ZonedDateTime;
  baseTemperature: number;
  dailyTemperatureChangeRange: { min: number; max: number };
}) {
  const data = useMemo(
    () =>
      getHourlyWeather(
        dateTime,
        52.697058,
        11.665210,
        baseTemperature,
        dailyTemperatureChangeRange,
      ),
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
          <XAxis dataKey="hour" />
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
