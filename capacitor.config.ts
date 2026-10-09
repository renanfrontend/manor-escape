import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "br.com.renanaugusto.manorescape",
  appName: "Manor Escape",
  // O app Android empacota o build do jogo (npm run build:app, base "/").
  webDir: "dist",
  backgroundColor: "#120b0c",
  server: {
    androidScheme: "https",
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
