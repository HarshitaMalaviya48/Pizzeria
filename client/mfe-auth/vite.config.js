import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "remote_auth_app",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/App.jsx",
        "./store/auth": "./src/store/auth.jsx",
        "./components/PrivateRoute": "./src/components/PrivateRoute.jsx",
        "./components/PublicRoute": "./src/components/PublicRoute.jsx",
      },
      remotes: {
        remote_user_app: "http://localhost:5002/assets/remoteEntry.js",
        remote_admin_app: "http://localhost:5003/assets/remoteEntry.js",
        host: "http://localhost:5000/assets/remoteEntry.js"
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
    port: 5001,
  },
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
