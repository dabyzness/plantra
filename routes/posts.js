import { Router } from "express";
import { isLoggedIn } from "../middleware/middleware.js";
import * as postsCtrl from "../controllers/posts.js";

const router = Router();

router.get("/new", isLoggedIn, postsCtrl.new);

router.post("/", isLoggedIn, postsCtrl.create);

router.get("/:postId", isLoggedIn, postsCtrl.view);

export { router };