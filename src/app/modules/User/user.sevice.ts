import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createToken } from "./user.utils";
import Config from "../../Config";

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

export const userServices = {
  registerUser,
  loginUser,
};
