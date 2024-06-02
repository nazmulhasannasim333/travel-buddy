import { Request, Response } from "express";
import { userProfileService } from "./userProfile.services";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";

const getUserProfileController = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.user;

    const userProfile = await userProfileService.getUserProfile(userId);

    if (!userProfile) {
      res.status(404).json({
        success: false,
        message: "User profile not found.",
      });
      return;
    }

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User profile retrieved successfully",
      data: userProfile,
    });
  }
);

const updateUserProfile = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.user; // Extract userId from the authenticated user
    const { name, email } = req.body;

    // Update the user profile
    const updatedProfile = await userProfileService.updateUserProfile(
      userId,
      name,
      email
    );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User profile updated successfully",
      data: updatedProfile,
    });
  }
);

export const userProfileController = {
  getUserProfileController,
  updateUserProfile,
};
