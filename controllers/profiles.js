import { Profile } from "../models/profile.js";
import { Plant } from "../models/plant.js";

function index(req, res) {
  Profile.findOne({ username: req.params.username })
    .populate({
      path: "plants",
      populate: {
        path: "plant",
      },
    })
    .then((profile) => {
      res.render("profiles/index", { title: "Your Profile", profile });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
}

function addPlantToCollectionView(req, res) {
  Profile.findOne({ username: req.params.username })
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
          res.redirect(`/profiles/${profile.username}`);
        });
    })
    .catch((err) => {
      console.log(err);
      res.redirect(`/profiles/${req.params.username}`);
    });
}

function addPlantToCollection(req, res) {
  Profile.findOne({ username: req.params.username })
    .then((profile) => {
      profile.plants.push(req.body);
      profile
        .save()
        .then(() => {
          res.redirect(`/profiles/${profile.username}/plants`);
        })
        .catch((err) => {
          console.log(err);
          res.redirect(`/profiles/${profile.username}`);
        });
    })
    .catch((err) => {
      console.log(err);
      res.redirect(`/profiles/${req.params.username}`);
    });
}

function waterPlant(req, res) {
  Profile.findOne({ username: req.params.username })
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
          res.redirect(`/profiles/${profile.username}`);
        })
        .catch((err) => {
          console.log(err);
          res.redirect(`/profiles/${profile.username}`);
        });
    })
    .catch((err) => {
      console.log(err);
      res.redirect(`/profiles/${req.params.username}`);
    });
}

function create(req, res) {
  if (!req.user.profile._id.equals(req.params.profileId)) {
    res.redirect("/");
  }

  Profile.findOneAndUpdate({ _id: req.params.profileId }, req.body)
    .then((profile) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
}

export {
  index,
  addPlantToCollectionView,
  addPlantToCollection,
  waterPlant,
  create,
};
