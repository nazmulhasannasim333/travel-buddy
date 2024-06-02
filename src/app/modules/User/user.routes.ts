import express from "express";
import { userController } from "./user.controller";
import validateRequest from "../../middleWare/validateRequest";
import { userValidation } from "./user.validation";
import auth from "../../middleWare/auth";

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
router.get("/users", userController.getAllUser);

router.patch("/status/:userId", userController.changeStatus);

router.patch("/role/:userId", userController.changeRole);

router.post("/change-password", auth(), userController.changePassword);

export const userRoutes = router;
