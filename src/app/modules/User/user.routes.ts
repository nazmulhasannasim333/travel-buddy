import express from "express";
import { userController } from "./user.controller";
import validateRequest from "../../middleWare/validateRequest";
import { userValidation } from "./user.validation";

const router = express.Router();

router.post(
  "/register",
  validateRequest(userValidation.UserCreateSchema),
  userController.registerUser
);
router.post(
  "/login",
  validateRequest(userValidation.UserLoginSchema),
  userController.loginUser
);

export const userRoutes = router;
