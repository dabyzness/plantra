import { Plant } from "../models/plant.js";
import { plantTypes } from "../data/plantTypes.js";
import { upload } from "../services/imageUpload.js";

const singleUpload = upload.single("image");

function newPlant(req, res) {
  res.render("plants/new", { title: "Add Plant", types: plantTypes });
}

function create(req, res) {
  singleUpload(req, res, function (err) {
    if (err) {
      return res.json({
        success: false,
        errors: {
          title: "Image Upload Error",
          detail: err.message,
          error: err,
        },
      });
    }

    req.body.img = req.file.location;

    Plant.create(req.body)
      .then((plant) => {
        res.redirect("/plants/new");
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/plants/new");
      });
  });
}

export { newPlant as new, create };
