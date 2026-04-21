import { z } from 'zod';

export const FormSchema = z.object({
  name: z.string().min(4, "The name must contain at least 4 characters"),
  lastName: z.string().min(4, "The name must contain at least 4 characters"),
  password: z.string()
    .min(8, "The password must contain at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/, 
      "The password must contain one uppercase letter, one lowercase letter, one number, and one symbol"
    ),
  message: z.string().min(10, "The message is too short") 
});


export type FormSchema = z.infer<typeof FormSchema>;