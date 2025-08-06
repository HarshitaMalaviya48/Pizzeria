const express = require("express");
const app = express();

const orderRoutes = require("./src/routes/order.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", orderRoutes);

module.exports = app;