import { Profile } from "../models/profile.js";
import { Plant } from "../models/plant.js";

function index(req, res) {
  Profile.findById(req.user.profile._id)
    .populate({
      path: "plants",
      populate: {
        path: "plant",
      },
    })
    .then((profile) => {
      console.log(JSON.stringify(profile.plants));
      res.render("profiles/index", { title: "Your Profile", profile });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
}

function addPlantToCollectionView(req, res) {
  Profile.findById(req.params.profileId)
    .then((profile) => {
      Plant.find({})
        .then((allPlants) => {
          res.render("profiles/new", {
            title: "Add Plant to Collection",
            profile,
            allPlants,
          });
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/profiles");
        });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/profiles");
    });
}

function addPlantToCollection(req, res) {
  Profile.findById(req.params.profileId)
    .then((profile) => {
      profile.plants.push(req.body);
      profile
        .save()
        .then(() => {
          res.redirect(`/profiles/${profile._id}/plants`);
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/profiles");
        });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/profiles");
    });
}

function waterPlant(req, res) {
  Profile.findById(req.params.profileId)
    .populate("plants")
    .then((profile) => {
      profile.plants[
        profile.plants.findIndex((plant) =>
          plant._id.equals(req.params.plantIdInColl)
        )
      ].isWatered = true;
      profile
        .save()
        .then(() => {
          res.redirect(`/profiles`);
        })
        .catch((err) => {
          console.log(err);
          res.redirect(`/profiles`);
        });
    })
    .catch((err) => {
      console.log(err);
      res.redirect(`/profiles`);
    });
}

export { index, addPlantToCollectionView, addPlantToCollection, waterPlant };
