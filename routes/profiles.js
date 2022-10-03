import { Router } from "express";
import { isLoggedIn } from "../middleware/middleware.js";
import * as profilesCtrl from "../controllers/profiles.js";

const router = Router();

router.get("/:username", isLoggedIn, profilesCtrl.index);

router.get(
  "/:username/plants",
  isLoggedIn,
  profilesCtrl.addPlantToCollectionView
);

router.get("/:username/plants/:plantId", isLoggedIn, profilesCtrl.view);

router.put("/:username", isLoggedIn, profilesCtrl.addPlantToCollection);

router.put("/:profileId/newProfile", isLoggedIn, profilesCtrl.create);

router.post(
  "/:username/plants/:plantId/addNote",
  isLoggedIn,
  profilesCtrl.addNote
);

router.patch(
  "/:username/water/:plantIdInColl",
  isLoggedIn,
  profilesCtrl.waterPlant
);

export { router };
