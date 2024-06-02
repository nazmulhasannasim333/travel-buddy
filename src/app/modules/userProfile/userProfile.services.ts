import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface TUser {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const getUserProfile = async (
  userId: string | undefined
): Promise<TUser | null> => {
  if (!userId) {
    return null; // Return null or handle the case where userId is not defined
  }

  const userProfile = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return userProfile;
};

const updateUserProfile = async (
  userId: string,
  name: string,
  email: string
): Promise<TUser | null> => {
  const updatedProfile = await prisma.user.update({
    where: { id: userId },
    data: { name, email },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return updatedProfile;
};

export const userProfileService = {
  getUserProfile,
  updateUserProfile,
};
