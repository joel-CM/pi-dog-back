const { Router } = require("express");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const { API_KEY } = process.env;

const { Temperament } = require("../db");
const { Op } = require("sequelize");

const axios = require("axios");

const route = Router();

route.get("/", async (req, res) => {
  const tempDB = await Temperament.findAll();
  if (tempDB.length) {
    return res.json({
      message: "Temperaments from DB",
      length: tempDB.length,
      results: tempDB,
    });
  }

  //todo -> traigo todas las razas
  const breeds = await axios.get(`https://api.thedogapi.com/v1/breeds`);

  //todo -> recorro todas las razas, y retorno en un obj SOLO sus props "temperament"
  const temperaments = breeds.data.map((breed) => {
    return {
      temperament: breed.temperament,
    };
  });

  //todo -> recorro cada temperamento, y filtro todos aquellos !== de undefined
  const filtrado = temperaments.filter(
    (breed) => breed.temperament !== undefined
  );

  //todo -> se usa más adelante
  const separado = [];

  //todo -> recorro cada temperamento, y pusheo sus props temperament a "separado"
  //todo: (separandolos por ",")
  filtrado.forEach((temp) => {
    separado.push(temp.temperament.split(","));
  });

  //todo -> Objeto Set (se usa más adelante)
  const mySet = new Set();

  //todo -> recorro cada array de "separado", y a su vez, recorro cada "string" (temperament)
  //todo: y los agrego al Objeto mySet = new Set()
  separado.forEach((arr) => {
    arr.forEach((str) => {
      mySet.add(str.trim());
    });
  });

  //todo -> creo un nuevo array con la copia de cada elemento de "mySet"
  const resTemps = [...mySet];

  //? GUARDAR TEMPERAMENTOS EN LA DB #################
  resTemps.forEach(async (temp) => {
    await Temperament.create({ name: temp });
  });

  //todo -> result
  res.json(resTemps);
});

module.exports = route;
