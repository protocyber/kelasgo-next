import { z } from 'zod';

export const registrationSchema = z
  .object({
    fullName: z.string().min(2, 'Nama lengkap minimal 2 karakter'),
    email: z.string().email('Email tidak valid'),
    password: z.string().min(6, 'Kata sandi minimal 6 karakter'),
    confirmPassword: z.string().min(6, 'Kata sandi minimal 6 karakter'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Kata sandi tidak cocok',
    path: ['confirmPassword'],
  });

export type RegistrationFormData = z.infer<typeof registrationSchema>;
