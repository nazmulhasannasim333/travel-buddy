import express from "express";
import { userRoutes } from "../modules/User/user.routes";
import { tripRoutes } from "../modules/Trip/trip.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/",
    route: tripRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
