import express from "express";

import { userProfileController } from "./userProfile.controller";
import auth from "../../middleWare/auth";

const router = express.Router();

router.get("/profile", auth(), userProfileController.getUserProfileController);

router.put("/profile", auth(), userProfileController.updateUserProfile);

export const userProfileRoutes = router;
