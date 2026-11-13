export type Review = {
  id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  name: string;
  branch?: string;
  approved: boolean;
};

export const REVIEWS: Review[] = [];
