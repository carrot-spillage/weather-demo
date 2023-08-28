export type WeatherBlock = {
  cloudDensity: number;
  rainIntensity: number;
};

export type CloudPeriod = {
  curve: Curve;
  period: number;
};

export function generateHourlyRainForYear(
  days: number,
) {
  const maxHours = 24 * 3;
  let hoursLeft = days * 24;

  const weatherEntries: WeatherBlock[] = [];

  while (hoursLeft > 0) {
    const period = Math.min(hoursLeft, Math.round(Math.random() * maxHours));
    const isOff = Math.random() < 0.5;
    if (isOff) {
      const none = { cloudDensity: 0, rainIntensity: 0 };
      weatherEntries.push(...new Array(period).fill(none));
    } else {
      const curve = calculateCloudCurve(period);
      weatherEntries.push(...generatePeriodData(curve));
    }
    hoursLeft -= period;
  }

  console.log(weatherEntries);
  return weatherEntries;
}

function generatePeriodData(curve: Curve) {
  return new Array(curve.length).fill(null).map((_, i) => {
    const density = getCloudDensity(
      i,
      curve.length,
      curve.max,
      curve.upRation,
      curve.downRatio,
    );

    return ({
      cloudDensity: density,
      rainIntensity: Math.max(0, density - curve.innerOffset),
    });
  });
}

type Curve = {
  upRation: number;
  downRatio: number;
  length: number;
  max: number;
  innerOffset: number;
};

function calculateCloudCurve(length: number): Curve {
  const outerMax = Math.random();
  const downStart = Math.random();
  const innerOffset = Math.random() * (outerMax ** 3);

  return {
    upRation: downStart,
    downRatio: 1 - downStart,
    length,
    max: outerMax,
    innerOffset,
  };
}

function getCloudDensity(
  currentPosition: number,
  length: number,
  max: number,
  upSplineRatio: number,
  downSplineRatio: number,
): number {
  // Ensure the transition doesn't exceed the specified duration
  if (currentPosition > length) {
    throw new Error("Current time cannot exceed transition duration");
  }

  // Normalized time between 0.0 and 1.0
  const t = currentPosition / length;

  // Cubic spline going up
  const splineUp = t < upSplineRatio
    ? (max / (upSplineRatio * upSplineRatio * upSplineRatio)) *
      t * t * t
    : max;

  // Cubic spline going down
  const splineDown = t > 1.0 - downSplineRatio
    ? (max / (downSplineRatio * downSplineRatio * downSplineRatio)) *
      (1.0 - t) * (1.0 - t) * (1.0 - t)
    : max;

  // Combine the two splines to create a smooth transition
  const density = splineUp * (1.0 - splineDown);

  return density;
}
