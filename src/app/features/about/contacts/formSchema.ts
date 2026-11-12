import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, { message: 'Il nome è troppo corto (minimo 2 caratteri)' }),
  email: z.string().email({ message: 'Inserisci un indirizzo e-mail valido' }),
  message: z.string().min(10, { message: 'Il messaggio deve contenere almeno 10 caratteri' }),
  privacyAccepted: z.boolean().refine((val) => val === true, {
    message: 'Devi accettare la politica sulla privacy per continuare',
  }),
});

export type ContactFormModel = z.infer<typeof contactSchema>;