import React, { useEffect, useState } from "react";
import * as SimplexNoise from "simplex-noise";
import rainCloudIconUrl from "./assets/rain-clouds.svg";
const N = 40; // Change this value to adjust the grid size N*N
const noise = SimplexNoise.createNoise2D();

const offset = { x: 0, y: 0 };

const PressureGrid: React.FC = () => {
  const [weatherGrid, setPressureGrid] = useState<Cell[][]>(() => initGrid());

  useEffect(() => {
    const interval = setInterval(() => {
      // Shift the pressure grid values by a random step of -1, 0, or 1 on both axes
      const randomStepX = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
      const randomStepY = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
      offset.x += randomStepX;
      offset.y += randomStepY;

      // Perform the shift operation on the pressure grid
      setPressureGrid((prevGrid) =>
        stepGrid(prevGrid, randomStepX, randomStepY)
      );
    }, 100); // Adjust the interval time (in milliseconds) as needed

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [weatherGrid]);

  useEffect(() => {
    // Update pressure values every 1 second
    const interval = setInterval(updatePressureGrid, 1000);
    return () => clearInterval(interval);
  }, []);

  const updatePressureGrid = () => {
  };

  return (
    <div className="flex flex-col">
      {weatherGrid.map((row, i) => (
        <div key={i} className="flex">
          {row.map((weatherCell, j) => (
            <div
              key={`${i}-${j}`}
              className="w-4 h-4"
              title={JSON.stringify(weatherCell, undefined, "  ")}
              style={{
                backgroundColor: valueToColor(weatherCell.pressure),
              }}
            >
              {weatherCell.precipitation > 0 && <img src={rainCloudIconUrl} />}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PressureGrid;

type Cell = { pressure: number; clouds: number; precipitation: number };

function stepGrid(
  prevGrid: Cell[][],
  randomStepX: number,
  randomStepY: number,
): Cell[][] {
  if (randomStepX == 0 && randomStepY == 0) return prevGrid;
  const newPressureGrid: Cell[][] = [];

  for (let i = 0; i < N; i++) {
    const newRow: Cell[] = [];
    for (let j = 0; j < N; j++) {
      const oldValueToMove = prevGrid[i - randomStepX]?.[j - randomStepY];
      const cell = oldValueToMove
        ? getNextCellState(oldValueToMove)
        : createCellState(i, j);

      newRow.push(cell);
    }
    newPressureGrid.push(newRow);
  }
  return newPressureGrid;
}

function createCellState(
  i: number,
  j: number,
): Cell {
  const pressure = noise((i - offset.x) / N, (j - offset.y) / N);
  const clouds = Math.random() * pressure * 0.2;
  const precipitation = -Math.random() +
    Math.random() * (1 - Math.pow(1 - clouds, 2));
  return { pressure, precipitation, clouds };
}

const limit = (x: number) =>
  Math.max(
    -1,
    Math.min(
      1,
      x,
    ),
  );

const signedRandom = () => (Math.random() * 2 - 1);

function getNextCellState(
  movedCell: Cell,
): Cell {
  const cloudsStep = movedCell.precipitation > 0
    ? (-Math.random() * movedCell.precipitation) // always shrinks cloud if raining
    : 0.2 * (signedRandom() +
      (movedCell.pressure > 0 ? 0.2 : 1) * Math.random() * movedCell.pressure);

  const clouds = limit(movedCell.clouds + cloudsStep);
  const precipitationStep = 0.1 *
    (-Math.random() * 1 + Math.random() * (1.5 * clouds));
  return {
    ...movedCell,
    clouds,
    precipitation: limit(movedCell.precipitation + precipitationStep),
  };
}

function initGrid(): Cell[][] {
  const initialPressureGrid: Cell[][] = [];
  for (let i = 0; i < N; i++) {
    const row: Cell[] = [];
    for (let j = 0; j < N; j++) {
      row.push(createCellState(i, j));
    }
    initialPressureGrid.push(row);
  }
  return initialPressureGrid;
}

function valueToColor(value: number): string {
  // Clamp the value between -1 and +1
  const clampedValue = Math.max(-1, Math.min(1, value));

  // Calculate the RGB values based on the clamped value
  let red, green;
  if (clampedValue >= 0) {
    red = 255;
    green = Math.floor((1 - clampedValue) * 255);
  } else {
    red = Math.floor((1 + clampedValue) * 255);
    green = 255;
  }

  return `rgb(${red}, ${green}, 0)`;
}
