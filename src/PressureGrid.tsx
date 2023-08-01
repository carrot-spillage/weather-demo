import React, { useEffect, useState } from "react";
import * as SimplexNoise from "simplex-noise";

const N = 40; // Change this value to adjust the grid size N*N
const noise = SimplexNoise.createNoise2D();

const offset = { x: 0, y: 0 };

const PressureGrid: React.FC = () => {
  const [pressureGrid, setPressureGrid] = useState<number[][]>([]);

  useEffect(() => {
    // Initialize the pressure grid with random pressure values between -1.0 and 1.0
    const initialPressureGrid: number[][] = initGrid();
    setPressureGrid(initialPressureGrid);
  }, []);

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
  }, [pressureGrid]);

  useEffect(() => {
    // Update pressure values every 1 second
    const interval = setInterval(updatePressureGrid, 1000);
    return () => clearInterval(interval);
  }, []);

  const updatePressureGrid = () => {
  };

  return (
    <div className="flex flex-col">
      {pressureGrid.map((row, i) => (
        <div key={i} className="flex">
          {row.map((pressure, j) => (
            <div
              key={`${i}-${j}`}
              className="w-4 h-4"
              title={pressure.toString()}
              style={{
                backgroundColor: valueToColor(pressure),
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default PressureGrid;

function stepGrid(
  prevGrid: number[][],
  randomStepX: number,
  randomStepY: number,
): number[][] {
  const newPressureGrid: number[][] = [];
  for (let i = 0; i < N; i++) {
    const newRow = [];
    for (let j = 0; j < N; j++) {
      const oldValueToMove = prevGrid[i - randomStepX]?.[j - randomStepY];

      // Check if the new index is within the valid range
      if (oldValueToMove !== undefined) {
        newRow.push(oldValueToMove);
      } else {
        // Generate a new value using the noise function if the new index is out of bounds
        newRow.push(noise((i - offset.x) / N, (j - offset.y) / N));
      }
    }
    newPressureGrid.push(newRow);
  }
  return newPressureGrid;
}

function initGrid() {
  const initialPressureGrid: number[][] = [];
  for (let i = 0; i < N; i++) {
    const row: number[] = [];
    for (let j = 0; j < N; j++) {
      row.push(noise(i / N, j / N));
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
