import { useState } from "react";
import YearlyWeather, { DayArgs } from "./YearlyWeather.tsx";
import { DailyWeather } from "./DailyWeather.tsx";
import { Temporal } from "@js-temporal/polyfill";
function App() {
  const [dayArgs, setDayArgs] = useState<DayArgs | null>(null);
  return (
    <>
      <YearlyWeather onDayChange={setDayArgs} />
      {dayArgs && (
        <DailyWeather
          dateTime={(dayArgs.plainDate as Temporal.PlainDate).toZonedDateTime({
            timeZone: "CET",
          })}
          baseTemperature={dayArgs.baseTemperature}
        />
      )}
    </>
  );
}

export default App;
