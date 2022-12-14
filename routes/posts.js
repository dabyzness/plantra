import { Router } from "express";
import { isLoggedIn } from "../middleware/middleware.js";
import * as postsCtrl from "../controllers/posts.js";

const router = Router();

router.get("/new", isLoggedIn, postsCtrl.new);

router.get("/all/:pageNum", isLoggedIn, postsCtrl.getAllPosts);

router.get("/:postId", isLoggedIn, postsCtrl.view);

router.post("/", isLoggedIn, postsCtrl.create);

router.patch("/:postId/like", isLoggedIn, postsCtrl.like);

router.patch("/:postId/comment", isLoggedIn, postsCtrl.addComment);

router.patch("/:postId/comment/:commentId", isLoggedIn, postsCtrl.likeComment);

router.delete(
  "/:postId/comment/:commentId",
  isLoggedIn,
  postsCtrl.deleteComment
);

export { router };
