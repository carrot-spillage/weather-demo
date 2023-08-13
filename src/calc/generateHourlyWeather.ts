import { Temporal } from "@js-temporal/polyfill";
import SunCalc from "suncalc";

export function generateHourlyWeather(
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
      value: baseTemperature +
        baseTemperature *
          (baseTemperature > 0 ? temperatureShift : -temperatureShift),
    };
  });
}
