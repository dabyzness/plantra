import { Router } from "express";
import { isLoggedIn } from "../middleware/middleware.js";
import * as profilesCtrl from "../controllers/profiles.js";

const router = Router();

router.get("/:username", isLoggedIn, profilesCtrl.index);

//Possibly delete
router.get("/:username/info", isLoggedIn, profilesCtrl.getUserInfo);

router.get(
  "/:username/plants",
  isLoggedIn,
  profilesCtrl.addPlantToCollectionView
);

router.get("/:username/plants/:plantId", isLoggedIn, profilesCtrl.view);

router.get("/:username/calendar", isLoggedIn, profilesCtrl.viewCalendar);

router.put("/:username", isLoggedIn, profilesCtrl.addPlantToCollection);

router.put("/:profileId/newProfile", isLoggedIn, profilesCtrl.create);

router.post(
  "/:username/plants/:plantId/addNote",
  isLoggedIn,
  profilesCtrl.addNote
);

router.patch("/:username", isLoggedIn, profilesCtrl.edit);

router.patch(
  "/:username/water/:plantIdInColl",
  isLoggedIn,
  profilesCtrl.waterPlant
);

router.delete("/:username/plants/:plantId", isLoggedIn, profilesCtrl.delete);

export { router };
