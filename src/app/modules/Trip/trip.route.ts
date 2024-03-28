import express from "express";

// Assuming you have authentication middleware
import { tripController } from "./trip.controller";
import auth from "../../middleWare/auth";

const router = express.Router();

router.post("/trips", auth(), tripController.createTrip);

export const tripRoutes = router;
