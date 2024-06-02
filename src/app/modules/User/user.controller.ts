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
const getAllUser = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const result = await userServices.getUserFromDB();
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Users retrieve successfully",
      data: result,
    });
  }
);

const changeStatus = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    const { status } = req.body;
    console.log(status);
    const result = await userServices.changeStatusFromDB(userId, status);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Status Change successfully",
      data: result,
    });
  }
);
const changeRole = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    const { role } = req.body;
    const result = await userServices.changeRoleFromDB(userId, role);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Role Change successfully",
      data: result,
    });
  }
);

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { ...passwordData } = req.body;

  await userServices.changePassword(user, passwordData);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Password changed successfully!",
    data: {
      status: 200,
      message: "Password changed successfully!",
    },
  });
});

export const userController = {
  registerUser,
  loginUser,
  getAllUser,
  changeStatus,
  changeRole,
  changePassword,
};
