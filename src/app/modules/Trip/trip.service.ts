import { Prisma, PrismaClient, TravelBuddyRequest, Trip } from "@prisma/client";
import { ITripFilterRequest } from "./tripInterface";
import { IPaginationOption } from "../../Interface/pagination";
import { paginationHelper } from "../../helpars/paginationHelpers";
import { tripSearchAbleFields } from "./trip.constant";

const prisma = new PrismaClient();

const createTrip = async (
  userId: string,
  destination: string,
  startDate: string,
  endDate: string,
  budget: number,
  activities: string[]
): Promise<Trip> => {
  const trip = await prisma.trip.create({
    data: {
      userId,
      destination,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      budget,
      activities,
    },
  });

  return trip;
};

const getFilteredTrips = async (
  params: ITripFilterRequest,
  options: IPaginationOption
) => {
  // Calculate pagination parameters
  const { page = 1, limit = 10 } = options;
  const skip = (page - 1) * limit;

  // Destructure filter parameters
  const { searchTerm, ...filterData } = params;

  // Build where conditions based on filter parameters
  const andCondition: Prisma.TripWhereInput[] = [];

  if (searchTerm) {
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
    const { destination, startDate, endDate, budget } = filterData;

    // Build filter conditions
    if (destination) {
      andCondition.push({ destination: { contains: destination } });
    }

    if (startDate) {
      andCondition.push({ startDate: { gte: new Date(startDate) } });
    }

    if (endDate) {
      andCondition.push({ endDate: { lte: new Date(endDate) } });
    }

    if (budget && (budget.minBudget || budget.maxBudget)) {
      andCondition.push({
        budget: {
          gte: budget.minBudget,
          lte: budget.maxBudget,
        },
      });
    }
  }

  // Construct final where condition
  const whereConditions: Prisma.TripWhereInput = { AND: andCondition };

  // Retrieve paginated and filtered trips
  const result = await prisma.trip.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [options.sortBy || "createdAt"]: options.sortOrder || "desc",
    },
  });

  // Get total count of filtered trips
  const total = await prisma.trip.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
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
  tripId: string
): Promise<TravelBuddyRequest[]> => {
  const potentialBuddies = await prisma.travelBuddyRequest.findMany({
    where: {
      tripId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return potentialBuddies;
};

export const tripServices = {
  createTrip,
  getFilteredTrips,
  sendTravelBuddyRequest,
  getPotentialTravelBuddies,
};
