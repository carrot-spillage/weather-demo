export function generateDailyWeatherForYear(
  totalDays: number,
  baseTemperature: number,
) {
  const summerPeakOffset = totalDays * 0.3;

  const amplitude = 1; // Adjust the amplitude of the sinusoid as needed
  const frequency = (2 * Math.PI) / totalDays; // Frequency for a yearly cycle (in radians)

  const positiveAmplification = 1.8;

  const data = new Array(totalDays).fill(0).map((_, day) => {
    const angle = frequency * (day - summerPeakOffset);
    let value = amplitude * Math.sin(angle) * baseTemperature;
    if (value > 0) {
      value = value * positiveAmplification;
    }
    return { day, value };
  });
  return data;
}
