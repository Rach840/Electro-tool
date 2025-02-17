import * as z from "zod";
export const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(
      /^\+?\d{1,4}?\s?\d{1,4}?\s?\d{1,4}?\s?\d{1,9}$/,
      "Invalid phone number",
    ),
});

export type UserProfileFormData = z.infer<typeof userSchema>;
