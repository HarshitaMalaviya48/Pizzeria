import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "host-app",
      remotes: {
        remote_auth_app: "http://localhost:5001/assets/remoteEntry.js",
        remote_user_app: "http://localhost:5002/assets/remoteEntry.js",
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
        "react-toastify": {
          singleton: true,
        },
      },
       
    }),
  ],
  

  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});

// remotes: {
//                 remote_auth_app: "http://localhost:5001/assets/remoteEntry.js",
//                 remote_user_app: "http://localhost:5002/assets/remoteEntry.js"
//             },
