import { Profile } from "../models/profile.js";
import { Plant } from "../models/plant.js";
import { upload } from "../services/imageUpload.js";

const singleUpload = upload.single("image");

function test(req, res) {
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

    console.log(req.file.location);

    Profile.findOne({ username: req.params.username }).then((profile) => {});
  });
}

function index(req, res) {
  Profile.findOne({ username: req.params.username })
    .populate([
      {
        path: "plants",
        populate: {
          path: "plant",
        },
      },
      { path: "posts" },
    ])
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

    req.body.img = [req.file.location];

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

  singleUpload(req, res, function (err) {
    if (!req.file) {
      Profile.findOneAndUpdate({ _id: req.params.profileId }, req.body)
        .then((profile) => {
          console.log(profile);
          res.redirect("/");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/");
        });
      return;
    }

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

    if (req.file.location) {
      req.body.avatar = req.file.location;
    }

    Profile.findOneAndUpdate({ _id: req.params.profileId }, req.body)
      .then((profile) => {
        console.log(profile);
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/");
      });
  });
}

function view(req, res) {
  Profile.findOne({ username: req.params.username })
    .populate([
      {
        path: "plants",
        populate: {
          path: "plant",
        },
      },
      { path: "posts" },
    ])
    .then((profile) => {
      console.log(profile);
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

function viewCalendar(req, res) {
  if (req.user.profile.username !== req.params.username) {
    res.redirect("/");
  }

  Profile.findOne({ username: req.params.username })
    .populate({
      path: "plants",
      populate: {
        path: "plant",
      },
    })
    .then((profile) => {
      profile.plants.forEach((plant) => {
        console.log(plant.nextWater.toLocaleDateString());
        console.log(
          plant.nextWater.toLocaleDateString() <=
            new Date().toLocaleDateString()
        );
      });

      console.log(new Date().toLocaleDateString());

      res.render("profiles/calendar", { title: "Calendar", profile });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
}

function deletePlant(req, res) {
  if (req.user.profile.username !== req.params.username) {
    res.redirect("/");
  }

  Profile.findOne({ username: req.params.username })
    .then((profile) => {
      profile.plants.pull({ _id: req.params.plantId });
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

function addImage(req, res) {
  if (req.user.profile.username !== req.params.username) {
    res.redirect("/");
  }

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

    Profile.findOne({ username: req.params.username })
      .then((profile) => {
        const plant = profile.plants.find((plant) =>
          plant._id.equals(req.params.plantId)
        );

        plant.img.unshift(req.file.location);
        profile
          .save()
          .then(() => {
            res.redirect(`/profiles/${req.params.username}/plant/${plant._id}`);
          })
          .catch((err) => {
            console.log(err);
            res.redirect(`/profiles/${req.params.username}/plant/${plant._id}`);
          });
      })
      .catch((err) => {
        console.log(err);
        res.redirect(
          `/profiles/${req.params.username}/plant/${req.params.plantId}`
        );
      });
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
  viewCalendar,
  deletePlant as delete,
  addImage,
};
