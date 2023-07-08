import { defineConfig } from "npm:vite";
import react from "npm:@vitejs/plugin-react-swc";

import "npm:suncalc";
import "npm:react";
import "npm:react-dom";
import "npm:recharts";
import "npm:@js-temporal/polyfill";

export default defineConfig({
  plugins: [react()],
});
