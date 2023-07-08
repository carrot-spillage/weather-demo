import { useState } from "react";
import YearlyWeather, { DayArgs } from "./YearlyWeather.tsx";
import { DailyWeather } from "./DailyWeather.tsx";

function App() {
  const [dayArgs, setDayArgs] = useState<DayArgs | null>(null);
  return (
    <>
      <YearlyWeather onDayChange={setDayArgs} />
      {dayArgs && (
        <DailyWeather
          dateTime={dayArgs.dateTime}
          baseTemperature={dayArgs.baseTemperature}
        />
      )}
    </>
  );
}

export default App;
