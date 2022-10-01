import { Router } from "express";
import { isLoggedIn } from "../middleware/middleware.js";
import * as plantsCtrl from "../controllers/plants.js";

const router = Router();

router.get("/new", isLoggedIn, plantsCtrl.new);

router.post("/", isLoggedIn, plantsCtrl.create);

export { router };
