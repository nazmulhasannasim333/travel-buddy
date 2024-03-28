import express from "express";
import { userRoutes } from "../modules/User/user.routes";
import { tripRoutes } from "../modules/Trip/trip.route";
import { userProfileRoutes } from "../modules/userProfile/userProfile.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/",
    route: userRoutes,
  },
  {
    path: "/",
    route: tripRoutes,
  },
  {
    path: "/",
    route: userProfileRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
