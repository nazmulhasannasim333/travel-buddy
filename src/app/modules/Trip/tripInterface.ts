export type ITripFilterRequest = {
  destination?: string;
  startDate?: string;
  endDate?: string;
  budget?: {
    minBudget?: number;
    maxBudget?: number;
  };
  searchTerm?: string;
};
