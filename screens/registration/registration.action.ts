import { useRegistrationFunc } from '@/lib/api/registration/registration.func';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, createElement } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { SplashToast } from '@/components/splash-toast';
import { z } from 'zod';

export const RegistrationSchema = z
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

export type RegistrationFormData = z.infer<typeof RegistrationSchema>;

export function useRegistrationAction() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const { mutation } = useRegistrationFunc({
    onSuccess: () => {
      // Setelah registrasi berhasil, arahkan ke halaman login
      toast.custom(() =>
        createElement(SplashToast, {
          message: 'Registrasi Berhasil. Anda akan diarahkan ke halaman login.',
          duration: 3,
          onComplete: () => {
            setTimeout(() => {
              router.push('/login');
            }, 0);
          },
        })
      );
    },
    onError: (err: unknown) => {
      const message =
        (err as { message?: string } | undefined)?.message ||
        'Registrasi gagal. Silakan coba lagi.';
      setError(message);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(RegistrationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegistrationFormData) => {
    setError(null);
    await mutation.mutateAsync({
      full_name: data.fullName,
      email: data.email,
      password: data.password,
    });
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    isSubmitting,
    errors,
    error,
  };
}
