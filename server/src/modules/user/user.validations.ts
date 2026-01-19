import { z } from "zod";
import { emailRegex } from "../../const";

export const signupInputValidationSchema = z.object({
  role: z
    .string({ required_error: "Role is required" })
    .min(3, "Role must be at least 3 characters")
    .max(20, "Role must not exceed 20 characters")
    .trim(),
  name: z
    .string({ required_error: "Name is required" })
    .min(3, "Name must be at least 3 characters")
    .max(20, "Name must not exceed 20 characters")
    .trim(),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Invalid email format")
    .regex(emailRegex, "Email format is incorrect"),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters"),
});
