import { Router } from "express";
import { isLoggedIn } from "../middleware/middleware.js";
import * as profilesCtrl from "../controllers/profiles.js";

const router = Router();

router.get("/", isLoggedIn, profilesCtrl.index);

router.get(
  "/:profileId/plants",
  isLoggedIn,
  profilesCtrl.addPlantToCollectionView
);

router.put("/:profileId", isLoggedIn, profilesCtrl.addPlantToCollection);

router.patch(
  "/:profileId/water/:plantIdInColl",
  isLoggedIn,
  profilesCtrl.waterPlant
);

export { router };
