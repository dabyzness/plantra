import { Profile } from "../models/profile.js";

function index(req, res) {
  Profile.findById(req.user.profile._id)
    .populate("plants")
    .then((profile) => {
      res.render("profiles/index", { title: "Your Profile", profile });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
}

export { index };
