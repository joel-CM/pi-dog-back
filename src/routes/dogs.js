const { Router } = require("express");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const { API_KEY } = process.env;

const { Dog, Temperament } = require("../db");
const { Op } = require("sequelize");
const axios = require("axios");
const route = Router();

route.get("/", async (req, res) => {
  const { name } = req.query;

  const dogs = await axios.get(`https://api.thedogapi.com/v1/breeds`);

  const breeds = dogs.data.map((breed) => {
    let imperial_1 = breed.weight.imperial.split("-")[0];
    let imperial_2 = breed.weight.imperial.split("-")[1];
    let weight = imperial_1 + " - " + imperial_2;
    return {
      id: breed.id,
      name: breed.name,
      height: breed.height.imperial,
      weight: weight,
      life_span: breed.life_span,
      temperament: breed.temperament,
      image: breed.image.url,
    };
  });

  //todo -> traemos razas de db y juntamos con lo de api
  const breedDB = await Dog.findAll({
    include: {
      model: Temperament,
    },
  });

  //todo: cambio un poco la estructura del obj de cada dogs de la DB
  const myDogsModel = breedDB.map((dog) => {
    return {
      id: dog.id,
      name: dog.name,
      height: dog.height,
      weight: dog.weight,
      life_span: dog.life_span,
      image: dog.image,
      createdInDb: dog.createdInDb,
      temperament: dog.temperaments.map((tmp) => tmp.name).join(", "),
    };
  });

  //todo: junto todos los perros de la API con los de la DB
  //todo: breeds ahora es un array con todos los dogs necesarios
  breeds.push(...myDogsModel);

  if (!name) {
    return res.status(200).json(breeds);
  } else {
    let minName = name;
    const breed = breeds.find((breed) =>
      breed.name.toLowerCase().includes(minName.toLowerCase())
    );
    if (breed) return res.json(breed);
    else return res.status(404).json({ message: "Breed not found" });
  }
});

route.get("/:idBreed", async (req, res) => {
  const { idBreed } = req.params;

  const breed = await axios.get(
    `https://api.thedogapi.com/v1/breeds?api_key=${API_KEY}`
  );

  if (idBreed.length < 10) {
    try {
      let breedById = breed.data.find(
        (breed) => breed.id === parseInt(idBreed)
      );

      let showRace = {
        id: breedById.id,
        name: breedById.name,
        height: breedById.height.imperial,
        weight: breedById.weight.imperial,
        life_span: breedById.life_span,
        temperament: breedById.temperament,
        image: breedById.image.url,
      };

//       console.log("Raza por IDDDDDDD " + typeof idRace + " - " + idRace);
      res.json(showRace);
    } catch (err) {
      console.log(err);
    }
  } else {
    try {
      let breedById = await Dog.findByPk(idBreed);

//       console.log("taza por UUIDDDDDDDDDDDDD" + typeof idRace + " - " + idRace);
      res.json(breedById);
    } catch (err) {
      console.log(err);
    }
  }
});

route.post("/", async (req, res) => {
  const { name, height, weight, life_span, image, temperament } = req.body;
  const createdDog = await Dog.create({
    name,
    height,
    weight,
    image: Array.from(image).length > 6 ? image : undefined,
    life_span,
  });

  for (let i = 0; i < temperament.length; i++) {
    let idTmp = await Temperament.findAll({
      where: {
        name: temperament[i],
      },
      attributes: ["id"],
    });
    createdDog.addTemperament(idTmp[0].id);
  }
  // console.log("Nombre: " + name + "Image: " + image);
  res.status(200).json({ messae: "dog create!" });
});

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

module.exports = route;
