export type ITripFilterRequest = {
  destination?: string | undefined;
  startDate?: string;
  endDate?: string;
  minBudget?: number | undefined;
  maxBudget?: number | undefined;
  searchTerm?: string;
};
