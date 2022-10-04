import { Post } from "../models/post.js";
import { Profile } from "../models/profile.js";

function newPost(req, res) {
  res.render("posts/new", { title: "New Post" });
}

function create(req, res) {
  req.body.owner = req.user.profile._id;

  Post.create(req.body)
    .then((post) => {
      Profile.findById(post.owner)
        .then((profile) => {
          profile.posts.push(post._id);
          profile
            .save()
            .then(() => {
              res.redirect(`/posts/${post._id}`);
            })
            .catch((err) => {
              console.log(err);
              res.redirect(`/profiles/${req.user.profile.username}`);
            });
        })
        .catch((err) => {
          console.log(err);
          res.redirect(`/profiles/${req.user.profile.username}`);
        });
    })
    .catch((err) => {
      console.log(err);
      res.redirect(`/profiles/${req.user.profile.username}`);
    });
}

function view(req, res) {
  Post.findById(req.params.postId)
    .populate("owner", "avatar username")
    .then((post) => {
      res.render("posts/view", { title: "View Post", post });
    });
}

export { newPost as new, create, view };
