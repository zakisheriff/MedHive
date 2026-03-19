const { z } = require("zod");

const registerSchema = z.object({
  clinicName: z.string().min(2).max(150),
  registrationNo: z.string().min(2).max(100),
  email: z.string().email().max(255),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be less than 72 characters"),
});

const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(1).max(72),
});

module.exports = {
  registerSchema,
  loginSchema,
};