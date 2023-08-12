import { useEffect, useMemo, useState } from "react";
import YearlyWeather, { DayArgs } from "./YearlyWeather.tsx";
import { DailyWeather } from "./DailyWeather.tsx";
import { Temporal } from "@js-temporal/polyfill";
import { run } from "./calc/train.ts";
import { generateHourlyRainForYear } from "./calc/generateHourlyRainForYear.ts";
import PressureGrid from "./PressureGrid.tsx";
function App() {
  const [dayArgs, setDayArgs] = useState<DayArgs | null>(null);
  // useEffect(() => {
  //   run();
  // }, []);
  const year = 2023;

  const hourlyRain = useMemo(() => {
    const startDate = new Temporal.PlainDate(year, 1, 1); // January 1st of the specified year
    const endDate = startDate.add({ years: 1 }).add({ days: -1 }); // December 31st of the specified year
    const totalDays = endDate.dayOfYear; // Total number of days
    return generateHourlyRainForYear(totalDays);
  }, [year]);

  const rainSequence = dayArgs &&
    hourlyRain.filter((x) => x.day == dayArgs.plainDate.dayOfYear);
  console.log(rainSequence, hourlyRain);
  return (
    <>
      <PressureGrid />
      <YearlyWeather year={year} onDayChange={setDayArgs} />
      {dayArgs && rainSequence && (
        <DailyWeather
          dateTime={(dayArgs.plainDate as Temporal.PlainDate).toZonedDateTime({
            timeZone: "CET",
          })}
          rainSequence={rainSequence}
          baseTemperature={dayArgs.baseTemperature}
          dailyTemperatureChangeRange={dayArgs.dailyTemperatureChangeRange}
        />
      )}
    </>
  );
}

export default App;
