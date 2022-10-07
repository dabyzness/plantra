import { Profile } from "../models/profile.js";
import { Plant } from "../models/plant.js";
import { upload } from "../services/imageUpload.js";

const singleUpload = upload.single("image");

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
      { path: "followers" },
      { path: "following" },
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
      const plant =
        profile.plants[
          profile.plants.findIndex((plant) =>
            plant._id.equals(req.params.plantIdInColl)
          )
        ];
      plant.isWatered = true;

      plant.lastWatered = new Date();

      plant.nextWater = new Date().setDate(
        new Date().getDate() + plant.wateringSchedule
      );

      plant.notes.push({});

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
        `/profiles/${req.params.username}/plants/${req.params.plantIdInColl}`
      );
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
  if (req.user.profile.username !== req.params.username) {
    res.redirect(`/profiles/${req.params.username}`);
    return;
  }

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
            res.redirect(
              `/profiles/${req.params.username}/plants/${plant._id}`
            );
          })
          .catch((err) => {
            console.log(err);
            res.redirect(
              `/profiles/${req.params.username}/plants/${plant._id}`
            );
          });
      })
      .catch((err) => {
        console.log(err);
        res.redirect(
          `/profiles/${req.params.username}/plants/${req.params.plantId}`
        );
      });
  });
}

function follow(req, res) {
  Profile.findOne({ username: req.params.username })
    .then((followedProfile) => {
      followedProfile.followers.push(req.user.profile._id);
      followedProfile
        .save()
        .then(() => {
          Profile.findById(req.user.profile._id)
            .then((followerProfile) => {
              followerProfile.following.push(followedProfile._id);
              followerProfile
                .save()
                .then(() => {
                  res.redirect(`/profiles/${req.params.username}`);
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
  follow,
};
