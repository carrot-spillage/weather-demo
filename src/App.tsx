import { useEffect, useState } from "react";
import YearlyWeather, { DayArgs } from "./YearlyWeather.tsx";
import { DailyWeather } from "./DailyWeather.tsx";
import { Temporal } from "@js-temporal/polyfill";
import { run } from "./calc/train.ts";
import PressureGrid from "./PressureGrid.tsx";
function App() {
  const [dayArgs, setDayArgs] = useState<DayArgs | null>(null);
  // useEffect(() => {
  //   run();
  // }, []);
  return (
    <>
      <PressureGrid />
      <YearlyWeather onDayChange={setDayArgs} />
      {dayArgs && (
        <DailyWeather
          dateTime={(dayArgs.plainDate as Temporal.PlainDate).toZonedDateTime({
            timeZone: "CET",
          })}
          baseTemperature={dayArgs.baseTemperature}
          dailyTemperatureChangeRange={dayArgs.dailyTemperatureChangeRange}
        />
      )}
    </>
  );
}

export default App;
