import { useState } from "react";
import "./App.css";
import YearlyWeather, { DayArgs } from "./YearlyWeather";
import { DailyWeather } from "./DailyWeather";

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
