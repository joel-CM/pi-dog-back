const { Router } = require("express");
const fs = require("fs");
const path = require("path");
const route = Router();

// const { API_KEY } = process.env;

const axios = require("axios");

route.get("/not_found", function (req, res, next) {
  res.sendFile(__dirname + "/img/interrogante.png");
});

route.get("/dog_img", function (req, res, next) {
  res.sendFile(__dirname + "/img/background-dog.jpg");
});
module.exports = route;
