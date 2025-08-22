import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import federation from "@originjs/vite-plugin-federation";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    federation({
      name: "remote_admin_app",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/App.jsx"
      }, 
      remotes:{
        "host": "http://localhost:5000/assets/remoteEntry.js"
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
    })
  ],
  server: {
  server: 5003,
},
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
})
