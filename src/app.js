const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const config = require("./config");

//todo: ------> importo las rutas
const dogRoutes = require("./routes/dogs");
const temRoutes = require("./routes/temperaments");
const imgs = require("./routes/imgs");

require("./db.js");

const server = express();

server.name = "API";

server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());
server.use(morgan("dev"));
server.use(cors(config.application.cors.server));

// todo-> rutas ######################
server.use("/api/dogs", dogRoutes);
server.use("/api/temperaments", temRoutes);
server.use("/api", imgs);

// Error catching endware.
server.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
