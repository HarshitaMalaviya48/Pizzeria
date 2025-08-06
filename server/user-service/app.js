const express = require("express");
const userRoutes = require("./src/routes/user.js");
const adminRoutes = require("./src/routes/admin.js");


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// Routes
console.log("in app");

app.use('/', userRoutes);
app.use("/", adminRoutes);

module.exports = app;
