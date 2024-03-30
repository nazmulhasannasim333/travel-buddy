import { z } from "zod";

const createTripValidation = z.object({
  destination: z.string().min(1, "Destination is required"),
  startDate: z.string(),
  endDate: z.string(),
  budget: z.number().min(0, "Budget must be a positive number"),
  activities: z.array(z.string()).min(1, "At least one activity is required"),
});

export const tripValidation = { createTripValidation };
