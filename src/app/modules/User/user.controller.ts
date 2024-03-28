import { Request, Response } from "express";

import { userServices } from "./user.sevice";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";

const registerUser = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, profile } = req.body;

    const user = await userServices.registerUser(
      name,
      email,
      password,
      profile
    );

    // Exclude password from the response
    const { password: _, ...userData } = user;

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "User registered successfully",
      data: userData,
    });
  }
);

const loginUser = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const user = await userServices.loginUser(email, password);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User logged in successfully",
      data: user,
    });
  }
);

export const userController = {
  registerUser,
  loginUser,
};
