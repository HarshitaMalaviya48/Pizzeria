const express = require("express");
const app = express();

const cartRoutes = require("./src/routes/cart.js")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", cartRoutes);

module.exports = app;