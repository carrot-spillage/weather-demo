import "https://cdn.skypack.dev/@tensorflow/tfjs-backend-webgpu";
import * as tf from "https://cdn.skypack.dev/@tensorflow/tfjs";

type DataPoint = {
  temperature: number;
  hour_of_day: number;
  elevation: number;
  surface_pressure: number;
  wind_speed: number;
  wind_angle: number;
  humidity: number;
  altitude: number;
};

// Function to generate fake historic data for a cell
function generateFakeData(numDataPoints: number) {
  const fakeData: DataPoint[] = [];
  for (let i = 0; i < numDataPoints; i++) {
    const dataPoint = {
      temperature: Math.random() * 100,
      hour_of_day: Math.random() * 24,
      elevation: Math.random() * 1000,
      surface_pressure: Math.random() * 1500,
      wind_speed: Math.random() * 50,
      wind_angle: Math.random() * 360,
      humidity: Math.random() * 100,
      altitude: Math.random() * 5000,
    };
    fakeData.push(dataPoint);
  }
  return fakeData;
}

// Fake historic data for a cell (10 data points)
const cellHistoricData = generateFakeData(10);

// Function to prepare the input data for training the model
function prepareInputData(historicData: DataPoint[]) {
  const inputFeatures = [];
  for (let i = 2; i < historicData.length; i++) {
    const dataWindow = [
      historicData[i - 2],
      historicData[i - 1],
      historicData[i], // current cell data
    ];
    inputFeatures.push(tf.tensor(Object.values(dataWindow), [3, 8]));
  }
  return tf.stack(inputFeatures);
}

// Function to prepare the output data for training the model
function prepareOutputData(historicData: DataPoint[]) {
  const outputFeatures = [];
  for (let i = 2; i < historicData.length; i++) {
    const nextData = historicData[i];
    outputFeatures.push(tf.tensor(Object.values(nextData), [8]));
  }
  return tf.stack(outputFeatures);
}
console.log("inting");
export function run() {
  console.log("starting");
  // Prepare the data for training
  const inputTensor = prepareInputData(cellHistoricData);
  const outputTensor = prepareOutputData(cellHistoricData);

  // Create and compile the model
  const model = tf.sequential();
  model.add(tf.layers.flatten({ inputShape: [3, 8] }));
  model.add(tf.layers.dense({ units: 32, activation: "relu" }));
  model.add(tf.layers.dense({ units: 16, activation: "relu" }));
  model.add(tf.layers.dense({ units: 8, activation: "linear" })); // Output layer with linear activation

  model.compile({ loss: "meanSquaredError", optimizer: "adam" });

  // Train the model
  async function trainModel() {
    const numEpochs = 50;
    const batchSize = 2;
    await model.fit(inputTensor, outputTensor, {
      epochs: numEpochs,
      batchSize,
    });
    console.log("Model training complete!");
  }

  // Call the trainModel function to start the training process
  trainModel()
    .then(() => {
      // Make predictions using the trained model
      const newDataWindow = [
        cellHistoricData[cellHistoricData.length - 2],
        cellHistoricData[cellHistoricData.length - 1],
        // Here, you can use actual data or other generated data for adjacent cells
        generateFakeData(1)[0],
      ];
      const inputTensorNewData = tf.tensor(newDataWindow, [1, 3, 8]);
      const predictions = model.predict(inputTensorNewData) as tf.Tensor;
      console.log("Predicted new values:");
      predictions.print();
    })
    .catch((error) => console.error("Error training the model:", error));
}
