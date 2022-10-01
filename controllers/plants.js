import { Plant } from "../models/plant.js";
import { plantTypes } from "../data/plantTypes.js";

function newPlant(req, res) {
  res.render("plants/new", { title: "Add Plant", types: plantTypes });
}

function create(req, res) {
  Plant.create(req.body)
    .then((plant) => {
      res.redirect("/plants/new");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/plants/new");
    });
}

export { newPlant as new, create };
