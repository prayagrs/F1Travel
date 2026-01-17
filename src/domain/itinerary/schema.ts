import { z } from "zod";
import type { BudgetTier } from "./types";

export const budgetTierSchema = z.enum(["$", "$$", "$$$"]);

export const tripRequestSchema = z.object({
  originCity: z.string().min(2, "Origin city must be at least 2 characters"),
  raceId: z.string().min(1, "Race ID is required"),
  durationDays: z
    .number()
    .int("Duration must be an integer")
    .min(2, "Duration must be at least 2 days")
    .max(30, "Duration must be at most 30 days"),
  budgetTier: budgetTierSchema,
});

export type TripRequestInput = z.infer<typeof tripRequestSchema>;
