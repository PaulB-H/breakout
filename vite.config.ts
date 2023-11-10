import { defineConfig } from "vite";
import checker from "vite-plugin-checker";

export default defineConfig({
  plugins: [
    checker({
      typescript: true,
      overlay: true, // This will show the error overlay in the browser
    }),
  ],
  server: { host: "0.0.0.0", port: 8000 },
  clearScreen: false,
  base: "/breakout",
});
