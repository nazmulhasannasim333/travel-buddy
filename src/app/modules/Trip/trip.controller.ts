import { Request, Response } from "express";
import { tripServices } from "./trip.service";
import catchAsync from "../../shared/catchAsync";
import pick from "../../shared/pick";
import { tripFilterAbleFields } from "./trip.constant";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";

const createTrip = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    // Ensure req.user is defined and contains userId
    const { userId } = req.user;
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

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Trip created successfully",
      data: trip,
    });
  }
);

const getTripsController = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
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
  }
);

const sendRequestController = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { tripId } = req.params;
    const { userId } = req.body;

    const request = await tripServices.sendTravelBuddyRequest(tripId, userId);

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Travel buddy request sent successfully",
      data: request,
    });
  }
);

const getPotentialBuddiesController = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { tripId } = req.params;

    const potentialBuddies = await tripServices.getPotentialTravelBuddies(
      tripId
    );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Potential travel buddies retrieved successfully",
      data: potentialBuddies,
    });
  }
);

const respondToBuddyRequestController = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { buddyId } = req.params;
    const { status } = req.body;

    const updatedRequest = await tripServices.respondToTravelBuddyRequest(
      buddyId,
      status
    );

    if (!updatedRequest) {
      res.status(404).json({
        success: false,
        message: "Travel buddy request not found.",
      });
      return;
    }

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Travel buddy request responded successfully",
      data: updatedRequest,
    });
  }
);

export const tripController = {
  createTrip,
  getTripsController,
  sendRequestController,
  getPotentialBuddiesController,
  respondToBuddyRequestController,
};
