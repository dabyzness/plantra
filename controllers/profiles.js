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
  console.log(req.body);

  Profile.findOneAndUpdate({ _id: req.params.profileId }, req.body)
    .then((profile) => {
      console.log(profile);
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
}

function view(req, res) {
  Profile.findOne({ username: req.params.username })
    .populate({
      path: "plants",
      populate: {
        path: "plant",
      },
    })
    .then((profile) => {
      const plant = profile.plants.id(req.params.plantId);
      res.render("profiles/viewPlant", {
        title: plant.nickname || plant.plant.name,
        plant,
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect(`/profiles/${req.params.username}`);
    });
}

function addNote(req, res) {
  Profile.findOne({ username: req.params.username })
    .populate("plants")
    .then((profile) => {
      const plant = profile.plants.id(req.params.plantId);
      plant.notes.push(req.body);
      profile
        .save()
        .then(() => {
          res.redirect(`/profiles/${profile.username}/plants/${plant._id}`);
        })
        .catch((err) => {
          console.log(err);
          res.redirect(`/profiles/${profile.username}/plants/${plant._id}`);
        });
    })
    .catch((err) => {
      console.log(err);
      res.redirect(
        `/profiles/${req.params.username}/plants/${req.params.plantId}`
      );
    });
}

function edit(req, res) {
  console.log("YAYAYAYYA", req.body);
  Profile.findOne({ username: req.params.username })
    .then((profile) => {
      if (req.body.username) {
        profile.username = req.body.username;
      } else if (req.body.bio) {
        profile.bio = req.body.bio;
      } else if (req.body.zone) {
        profile.zone = req.body.zone;
      }

      profile
        .save()
        .then((updatedProfile) => {
          res.redirect(`/profiles/${updatedProfile.username}`);
        })
        .catch((err) => {
          console.log(err);
          res.redirect(`/profiles/${req.params.username}`);
        });
    })
    .catch((err) => {
      console.log(err);
      res.redirect(`/profiles/${req.params.username}`);
    });
}

// Possibly delete
function getUserInfo(req, res) {
  Profile.findOne({ username: req.params.username })
    .populate({
      path: "plants",
      populate: {
        path: "plant",
      },
    })
    .then((profile) => {
      res.json(profile);
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
  view,
  addNote,
  edit,
  getUserInfo,
};
