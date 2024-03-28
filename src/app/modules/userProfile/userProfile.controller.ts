import { Request, Response } from "express";
import { userProfileService } from "./userProfile.services";

const getUserProfileController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.user; // Assuming user ID is available in the request object after authentication middleware

    const userProfile = await userProfileService.getUserProfile(userId);

    if (!userProfile) {
      res.status(404).json({
        success: false,
        message: "User profile not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "User profile retrieved successfully",
      data: userProfile,
    });
  } catch (error) {
    console.error("Error retrieving user profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error while retrieving user profile.",
    });
  }
};

const updateUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {userId} = req.user; // Extract userId from the authenticated user
    const { name, email } = req.body;

    // Update the user profile
    const updatedProfile = await userProfileService.updateUserProfile(
      userId,
      name,
      email
    );

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "User profile updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error during user profile update",
    });
  }
};

export const userProfileController = {
  getUserProfileController,
  updateUserProfile
};
