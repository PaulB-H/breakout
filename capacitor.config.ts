import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.example.app",
  appName: "phaser3-typescript-vite-template",
  webDir: "dist",
  server: {
    androidScheme: "https",

    url: "http://192.168.2.13:8000",
    cleartext: true,
  },
};

export default config;
