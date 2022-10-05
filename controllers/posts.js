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
      if (post.likedBy.includes(req.user.profile._id)) {
        post.likes -= 1;
        post.likedBy.pull({ _id: req.user.profile._id });
      } else {
        post.likes += 1;
        post.likedBy.push({ _id: req.user.profile._id });
      }

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

function likeComment(req, res) {
  Post.findById(req.params.postId)
    .then((post) => {
      const comment = post.comments.find((comment) =>
        comment._id.equals(req.params.commentId)
      );

      console.log("COMMENT", comment);
      console.log("COMMENT ID", req.params.commentId);

      if (comment.likedBy.includes(req.user.profile._id)) {
        comment.likes -= 1;
        comment.likedBy.pull({ _id: req.user.profile._id });
      } else {
        comment.likes += 1;
        comment.likedBy.push({ _id: req.user.profile._id });
      }

      post.save().then(() => {
        res.redirect(`/posts/${post._id}`);
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect(`/posts/${req.params.postId}`);
    });
}

function deleteComment(req, res) {
  Post.findById(req.params.postId)
    .then((post) => {
      const comment = post.comments.find((comment) =>
        comment._id.equals(req.params.commentId)
      );

      if (!req.user.profile._id.equals(comment.owner)) {
        res.redirect("/");
      }

      post.comments.pull(req.params.commentId);
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

export {
  newPost as new,
  create,
  view,
  like,
  addComment,
  likeComment,
  deleteComment,
};
