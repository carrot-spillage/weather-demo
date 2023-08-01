import { defineConfig } from "npm:vite";
import react from "npm:@vitejs/plugin-react-swc";

import "npm:suncalc";
import "npm:react";
import "npm:react-dom";
import "npm:recharts";
import "npm:@js-temporal/polyfill";
import "npm:simplex-noise";
// import "npm:@tensorflow/tfjs";
// import "npm:@tensorflow/tfjs-backend-webgpu";

export default defineConfig({
  plugins: [react()],
});
