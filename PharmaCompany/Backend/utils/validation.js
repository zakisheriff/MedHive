import { z } from "zod";

export const registerSchema = z.object({
  companyName: z.string().min(2),
  registrationNumber: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});