import { Router } from "express";
import { isLoggedIn } from "../middleware/middleware.js";
import * as postsCtrl from "../controllers/posts.js";

const router = Router();

router.get("/posts", isLoggedIn, postsCtrl.new);

export { router };
