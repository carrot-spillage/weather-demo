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
) {
  const startOfDay = dateTime.toInstant();

  return new Array(24).fill(0).map((_, hour) => {
    const hourlyInstant = startOfDay.add({ hours: hour - 1 }); // to offset temperature change that takes an hour to have an effect
    console.log("baseTemperature", baseTemperature);
    const { altitude } = SunCalc.getPosition(
      new Date(hourlyInstant.epochMilliseconds),
      latitude,
      longitude,
    );
    return { hour, value: baseTemperature + altitude * 1.5 };
  });
}

export function DailyWeather({
  dateTime,
  baseTemperature,
}: {
  dateTime: Temporal.ZonedDateTime;
  baseTemperature: number;
}) {
  const data = useMemo(
    () => getHourlyWeather(dateTime, 35.6762, 139.6503, baseTemperature),
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
            name="Flattened Sinusoid"
            stroke="#8884d8"
            dot={false}
          />
        </LineChart>
      </div>
    </div>
  );
}
