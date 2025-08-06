const express = require("express");
const app = express();
const pizzasRoute = require("./src/displayPizza.js");

app.use("/images", express.static("public/images"));

app.use("/", pizzasRoute);

module.exports = app;