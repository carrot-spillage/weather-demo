export function generateHourlyRainForYear(
  days: number,
) {
  const maxHours = 24 * 3;
  let sequence: {
    untilIndex: number;
    strength: number;
  } = { untilIndex: 0, strength: 0 };
  return new Array(days * 24).fill(0).map((_, hour: number) => {
    if (sequence.untilIndex <= hour) {
      sequence = {
        untilIndex: hour + Math.round(Math.random() * maxHours),
        strength: Math.random(),
      };

      console.log(sequence, {
        day: Math.floor(hour / 24),
        hour: hour % 24,
        strength: sequence.strength,
      });
    }

    return {
      day: Math.floor(hour / 24),
      hour: hour % 24,
      strength: sequence.strength,
    };
  });
}
