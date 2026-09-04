import { z } from 'zod';

export const FormSchema = z.object({
  name: z.string().min(4, "Name must be at least 4 characters"),
  lastName: z.string().min(4, "Last name must be at least 4 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type FormSchema = z.infer<typeof FormSchema>;
