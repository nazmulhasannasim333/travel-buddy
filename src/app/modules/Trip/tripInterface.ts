export type ITripFilterRequest = {
  destination?: string | undefined;
  startDate?: string | undefined;
  endDate?: string;
  minBudget?: number | undefined;
  maxBudget?: number | undefined;
  searchTerm?: string;
};
