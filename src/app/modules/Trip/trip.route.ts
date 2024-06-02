import express from "express";

// Assuming you have authentication middleware
import { tripController } from "./trip.controller";
import auth from "../../middleWare/auth";
import validateRequest from "../../middleWare/validateRequest";
import { tripValidation } from "./trip.validation";

const router = express.Router();

router.post(
  "/trips",
  auth(),
  validateRequest(tripValidation.createTripValidation),
  tripController.createTrip
);
router.get("/trips", tripController.getTripsController);

router.get("/trips/:id", tripController.getSingleTrip);

router.get("/userTrip", auth(), tripController.getUserTrip);

router.post(
  "/trip/:tripId/request",
  auth(),
  tripController.sendRequestController
);

router.get(
  "/travel-buddies",
  auth(),
  tripController.getPotentialBuddiesController
);

router.put(
  "/travel-buddies/:buddyId/respond",
  auth(),
  tripController.respondToBuddyRequestController
);

router.delete("/trip/:tripId", auth(), tripController.deleteTrip);

export const tripRoutes = router;
