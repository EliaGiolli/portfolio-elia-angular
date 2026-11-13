import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
  privacyAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the privacy policy to continue',
  }),
});

export type ContactFormModel = z.infer<typeof contactSchema>;