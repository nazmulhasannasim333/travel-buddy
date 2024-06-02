import { Prisma, PrismaClient, TravelBuddyRequest, Trip } from "@prisma/client";
import { ITripFilterRequest } from "./tripInterface";
import { IPaginationOption } from "../../Interface/pagination";

const prisma = new PrismaClient();

const createTrip = async (
  userId: string,
  destination: string,
  description: string,
  startDate: string,
  endDate: string,
  budget: number,
  type: string,
  photo: string,
  activities: string[]
): Promise<Trip> => {
  const trip = await prisma.trip.create({
    data: {
      userId,
      destination,
      description,
      startDate,
      endDate,
      budget,
      type,
      photo,
      activities,
    },
  });

  return trip;
};

const getFilteredTrips = async (
  params: ITripFilterRequest,
  options: IPaginationOption
) => {
  const { page = 1, limit = 10 } = options;
  const skip = (page - 1) * limit;

  const { searchTerm, ...filterData } = params;
  const andCondition: Prisma.TripWhereInput[] = [];

  if (searchTerm) {
    const tripSearchAbleFields = ["destination", "date", "type"];
    andCondition.push({
      OR: tripSearchAbleFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    const {
      destination,
      startDate,
      endDate,
      minBudget,
      maxBudget,
      type,
      description,
    } = filterData;
    if (destination) {
      andCondition.push({
        destination: { contains: destination },
      });
    }

    if (description) {
      andCondition.push({
        description: { contains: description },
      });
    }

    if (type) {
      andCondition.push({
        type: { contains: type },
      });
    }

    if (startDate) {
      andCondition.push({
        startDate: {
          gte: new Date(startDate).toISOString(),
        },
      });
    }

    if (endDate) {
      andCondition.push({
        endDate: {
          lte: new Date(endDate).toISOString(),
        },
      });
    }

    if (
      (minBudget !== undefined || minBudget !== null) &&
      !isNaN(Number(minBudget))
    ) {
      andCondition.push({
        budget: {
          gte: Number(minBudget),
        },
      });
    }

    if (
      (maxBudget !== undefined || maxBudget !== null) &&
      !isNaN(Number(maxBudget))
    ) {
      andCondition.push({
        budget: {
          lte: Number(maxBudget),
        },
      });
    }
  }

  const whereConditions: Prisma.TripWhereInput = { AND: andCondition };

  const result = await prisma.trip.findMany({
    where: whereConditions,
    skip,
    take: Number(limit),
    orderBy: {
      [options.sortBy || "createdAt"]: options.sortOrder || "desc",
    },
  });

  const total = await prisma.trip.count({
    where: whereConditions,
  });

  return {
    success: true,
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleTripFromDB = async (id: string) => {
  const result = await prisma.trip.findUniqueOrThrow({
    where: {
      id: id,
    },
  });
  return result;
};

const getUserTripFromDB = async (userId: string) => {
  const result = await prisma.trip.findMany({
    where: {
      userId: userId,
    },
  });
  return result;
};

const deleteTripFromDB = async (id: string) => {
  const result = await prisma.trip.delete({
    where: {
      id: id,
    },
  });

  return result;
};

const sendTravelBuddyRequest = async (
  tripId: string,
  userId: string
): Promise<TravelBuddyRequest> => {
  const request = await prisma.travelBuddyRequest.create({
    data: {
      tripId,
      userId,
      status: "PENDING",
    },
  });

  return request;
};

const getPotentialTravelBuddies = async (
  userId: string
): Promise<TravelBuddyRequest[]> => {
  const potentialBuddies = await prisma.travelBuddyRequest.findMany({
    where: {
      userId,
    },
    include: {
      trip: {
        select: {
          id: true,
          destination: true,
          description: true,
          photo: true,
          startDate: true,
          endDate: true,
        },
      },
    },
  });

  return potentialBuddies;
};

const respondToTravelBuddyRequest = async (
  buddyId: string,
  status: string
): Promise<TravelBuddyRequest | null> => {
  const updatedRequest = await prisma.travelBuddyRequest.update({
    where: {
      id: buddyId,
    },
    data: {
      status,
      updatedAt: new Date(),
    },
  });

  return updatedRequest;
};

export const tripServices = {
  createTrip,
  getFilteredTrips,
  sendTravelBuddyRequest,
  getPotentialTravelBuddies,
  respondToTravelBuddyRequest,
  getSingleTripFromDB,
  deleteTripFromDB,
  getUserTripFromDB,
};
