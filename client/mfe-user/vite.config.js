import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "remote_user_app",
      filename: "remoteEntry.js",
      remotes: {
        remote_auth_app: "http://localhost:5001/assets/remoteEntry.js",
        host: "http://localhost:5000/assets/remoteEntry.js"
      },
      exposes: {
        "./App": "./src/App.jsx",
      },
      shared: {
        "react": {
          singleton: true,
        },
        "react-dom": {
          singleton: true,
        },
        "react-router-dom": {
          singleton: true,
        },
      },
    }),
  ],
server: {
  server: 5002,
},
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
