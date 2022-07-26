require("dotenv").config();
const client = require("./db/client.js");
const express = require("express");
const apiRouter = require("./api");
const app = express();

client.connect();
const cors = require("cors");
const morgan = require("morgan");

app.use(morgan("dev"));
app.use(express.json());

app.use(cors());
app.use("/api", apiRouter);

// Setup your Middleware and API Router here

// ROUTER: /api/unknown
app.get("*", (req, res) => {
  res
    .status(404)
    .send({
      error: "404 - Not Found",
      message: "No route found for the requested URL",
    });
});

app.use((error, req, res, _) => {
  if (res.statusCode < 400) res.status(500);
  res.send({ error: error.message, name: error.name, message: error.message });
});

module.exports = app;
