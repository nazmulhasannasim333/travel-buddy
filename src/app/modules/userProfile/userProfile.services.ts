import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

const getUserProfile = async (
  userId: string | undefined
): Promise<User | null> => {
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
  ): Promise<User | null> => {
    try {
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
    } catch (error) {
      console.error('Error updating user profile:', error);
      return null;
    }
  };
  
export const userProfileService = {
  getUserProfile,
  updateUserProfile
};
