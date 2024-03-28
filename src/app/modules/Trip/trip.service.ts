import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createTrip = async (
  userId: string,
  destination: string,
  startDate: string,
  endDate: string,
  budget: number,
  activities: string[]
): Promise<any> => {
  const trip = await prisma.trip.create({
    data: {
      userId,
      destination,
      startDate,
      endDate,
      budget,
      activities,
    },
  });

  return trip;
};

export const tripServices = {
  createTrip,
};
