import express from "express";

// Assuming you have authentication middleware
import { tripController } from "./trip.controller";
import auth from "../../middleWare/auth";

const router = express.Router();

router.post("/trips", auth(), tripController.createTrip);
router.get("/trips", tripController.getTripsController);

router.post(
  "/trip/:tripId/request",
  auth(),
  tripController.sendRequestController
);

router.get(
  "/travel-buddies/:tripId",
  auth(),
  tripController.getPotentialBuddiesController
);

router.put(
  "/travel-buddies/:buddyId/respond",
  auth(),
  tripController.respondToBuddyRequestController
);
export const tripRoutes = router;
