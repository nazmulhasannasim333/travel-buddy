import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthUtils, createToken } from "./user.utils";
import Config from "../../Config";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { hashedPassword } from "../../helpars/hashPasswordHelper";

const prisma = new PrismaClient();

const registerUser = async (
  name: string,
  email: string,
  password: string,
  profile: any
): Promise<any> => {
  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userExists) {
    throw new Error("User already exists!");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.$transaction(async (prisma) => {
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    await prisma.userProfile.create({
      data: { userId: newUser.id, bio: profile.bio, age: profile.age },
    });

    return newUser;
  });

  //   const token = generateToken(user.id);

  return { ...user };
};

const loginUser = async (email: string, password: string): Promise<any> => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid password.");
  }

  const jwtPayload = {
    name: user.name,
    email: user.email,
    userId: user.id,
    role: user.role,
  };

  const token = createToken(
    jwtPayload,
    Config.jwt.jwt_secret as string,
    Config.jwt.expires_in as string
  );

  // Omitting password from user data
  const { password: _, ...userData } = user;

  return { ...userData, token };
};

const getUserFromDB = async () => {
  const user = await prisma.user.findMany({});
  return user;
};

const changeStatusFromDB = async (userId: string, status: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { status },
  });

  return updatedUser;
};

const changeRoleFromDB = async (userId: string, role: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const updatedUserRole = await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  return updatedUserRole;
};

const changePassword = async (
  user: JwtPayload | null,
  payload: any
): Promise<void> => {
  const { oldPassword, newPassword } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: {
      id: user?.userId,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
  }

  // checking old password
  if (
    isUserExist.password &&
    !(await AuthUtils.comparePasswords(oldPassword, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Old Password is incorrect");
  }

  const hashPassword = await hashedPassword(newPassword);

  await prisma.user.update({
    where: {
      id: isUserExist.id,
    },
    data: {
      password: hashPassword,
    },
  });
};

export const userServices = {
  registerUser,
  loginUser,
  getUserFromDB,
  changeStatusFromDB,
  changeRoleFromDB,
  changePassword,
};
