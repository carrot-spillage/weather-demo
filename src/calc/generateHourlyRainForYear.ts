export function generateHourlyRainForYear(
  days: number,
) {
  const maxHours = 24 * 3;
  let sequence: {
    untilIndex: number;
    strength: number;
  } = { untilIndex: 0, strength: 0 };
  return new Array(days * 24).fill(0).map((_, hour: number) => {
    const rainChance = 0.2;
    const rainFreeChance = 1 - rainChance;

    if (sequence.untilIndex <= hour) {
      const currentRainRandom = Math.random();
      sequence = {
        untilIndex: hour + Math.round(Math.random() * maxHours),
        strength: currentRainRandom > rainFreeChance
          ? (currentRainRandom - rainFreeChance) * (1 / rainChance)
          : 0,
      };
    }

    return {
      day: Math.floor(hour / 24),
      hour: hour % 24,
      strength: sequence.strength,
    };
  });
}
