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
    .populate([
      { path: "owner" },
      {
        path: "comments",
        populate: {
          path: "owner",
        },
      },
    ])
    .then((post) => {
      res.render("posts/view", { title: "View Post", post });
    });
}

function like(req, res) {
  Post.findById(req.params.postId)
    .then((post) => {
      post.likes += 1;
      post
        .save()
        .then(() => {
          res.redirect(`/posts/${req.params.postId}`);
        })
        .catch((err) => {
          console.log(err);
          res.redirect(`/posts/${req.params.postId}`);
        });
    })
    .catch((err) => {
      console.log(err);
      res.redirect(`/posts/${req.params.postId}`);
    });
}

function addComment(req, res) {
  Post.findById(req.params.postId)
    .then((post) => {
      req.body.owner = req.user.profile._id;
      post.comments.push(req.body);
      post
        .save()
        .then(() => {
          res.redirect(`/posts/${post._id}`);
        })
        .catch((err) => {
          console.log(err);
          res.redirect(`/posts/${post._id}`);
        });
    })
    .catch((err) => {
      console.log(err);
      res.redirect(`/posts/${req.params.postId}`);
    });
}

export { newPost as new, create, view, like, addComment };
