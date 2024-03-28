import { Request, Response } from "express";
import { tripServices } from "./trip.service";
import catchAsync from "../../shared/catchAsync";
import pick from "../../shared/pick";
import { tripFilterAbleFields } from "./trip.constant";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";

const createTrip = async (req: Request, res: Response): Promise<void> => {
  try {
    // Ensure req.user is defined and contains userId
    const { userId } = req.user;
    console.log(userId);
    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not found",
      });
      return;
    }

    const { destination, startDate, endDate, budget, activities } = req.body;

    const trip = await tripServices.createTrip(
      userId,
      destination,
      startDate,
      endDate,
      budget,
      activities
    );

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Trip created successfully",
      data: trip,
    });
  } catch (error) {
    console.error("Error creating trip:", error);
    res.status(500).json({
      success: false,
      message: "Server error during trip creation.",
    });
  }
};

const getTripsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const filters = pick(req.query, tripFilterAbleFields);

  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await tripServices.getFilteredTrips(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Trips retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
};

const sendRequestController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { tripId } = req.params;
    const { userId } = req.body;

    const request = await tripServices.sendTravelBuddyRequest(tripId, userId);

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Travel buddy request sent successfully",
      data: request,
    });
  } catch (error) {
    console.error("Error sending travel buddy request:", error);
    res.status(500).json({
      success: false,
      message: "Server error during travel buddy request sending.",
    });
  }
};

const getPotentialBuddiesController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { tripId } = req.params;

    const potentialBuddies = await tripServices.getPotentialTravelBuddies(
      tripId
    );

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Potential travel buddies retrieved successfully",
      data: potentialBuddies,
    });
  } catch (error) {
    console.error("Error retrieving potential travel buddies:", error);
    res.status(500).json({
      success: false,
      message: "Server error while retrieving potential travel buddies.",
    });
  }
};

export const tripController = {
  createTrip,
  getTripsController,
  sendRequestController,
  getPotentialBuddiesController,
};
