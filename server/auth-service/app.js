const express = require("express");
const proxy = require("express-http-proxy");
const cors = require("cors");
const userRoutes = require("./src/routes/user.js");
const authRoutes = require("./src/routes/auth.js");
const adminRoutes = require("./src/routes/admin.js");
const forgetPasswordRoutes = require("./src/routes/forgot-password.js");
const {
  authMiddleware,
  adminOnly,
  userOnly,
} = require("./src/middleware/jwt.js");
const createProxyReqOptDecorator = require("./src/utils/proxyDecorator.js");

const app = express();

const corsOption = {
  origin: ["http://localhost:5000", "http://localhost:5001", "http://localhost:5002", "http://localhost:5003", "http://localhost:3002", "http://localhost:3003", "http://localhost:3001", "http://localhost:3004"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credential: true
}

app.use(cors(corsOption));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
console.log("in app");

app.use("/api/auth", authRoutes);
app.use("/api/auth", forgetPasswordRoutes);
app.use("/", userRoutes);
app.use("/", adminRoutes);

const decorater = createProxyReqOptDecorator();
app.use(
  "/admin",
  authMiddleware,
  adminOnly,
  proxy("http://localhost:3002", {
    proxyReqOptDecorator: decorater,
  })
);
app.use(
  "/users",
  authMiddleware,
  userOnly,
  proxy("http://localhost:3002", {
    proxyReqOptDecorator: decorater,
  })
);

app.use(
  "/pizza",
  authMiddleware,
  userOnly,
  proxy("http://localhost:3001", {
    proxyReqOptDecorator: decorater,
  })
);

app.use(
  "/cart",
  authMiddleware,
  userOnly,
  proxy("http://localhost:3003", {
    proxyReqOptDecorator: decorater,
  })
);


app.use(
  "/order/user",
  authMiddleware,
  userOnly,
  proxy("http://localhost:3004", { proxyReqOptDecorator: decorater })
);

app.use(
  "/order/admin",
  authMiddleware,
  adminOnly,
  proxy("http://localhost:3004", { proxyReqOptDecorator: decorater })
);

module.exports = app;
