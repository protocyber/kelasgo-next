import { useTenantFunc } from '@/lib/api/tenant/tenant.func';
import { CreateTenantInput } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// Schema validation untuk form
export const CreateTenantSchema = z.object({
  name: z
    .string()
    .min(1, 'Nama wajib diisi')
    .max(255, 'Nama maksimal 255 karakter'),
  domain: z
    .string()
    .max(255, 'Domain maksimal 255 karakter')
    .optional()
    .or(z.literal('')),
  contactEmail: z
    .string()
    .email('Email tidak valid')
    .max(255, 'Email maksimal 255 karakter')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .max(50, 'Nomor telepon maksimal 50 karakter')
    .optional()
    .or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
});

export type CreateTenantFormData = z.infer<typeof CreateTenantSchema>;

// Transform form data ke format API
function transformFormDataToInput(
  data: CreateTenantFormData
): CreateTenantInput {
  return {
    name: data.name,
    domain: data.domain || undefined,
    contact_email: data.contactEmail || undefined,
    phone: data.phone || undefined,
    address: data.address || undefined,
  };
}

// Action untuk submit tenant
export function useCreateTenantAction() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { createTenantMutation } = useTenantFunc({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });

      const message = onSuccess(response);
      toast.success(message);
      setOpen(false);
      reset();
      setError(null);
    },
    onError: (err: unknown) => {
      const message = onError(err);
      setError(message);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateTenantFormData>({
    resolver: zodResolver(CreateTenantSchema),
    defaultValues: {
      name: '',
      domain: '',
      contactEmail: '',
      phone: '',
      address: '',
    },
  });

  const onSubmit = async (data: CreateTenantFormData) => {
    setError(null);
    const input = transformFormDataToInput(data);
    await createTenantMutation.mutateAsync(input);
  };

  return {
    open,
    setOpen,
    error,
    isSubmitting,
    register,
    handleSubmit,
    onSubmit,
    errors,
    reset,
    setError,
  };
}

// Handler untuk success response
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onSuccess(response: any) {
  // Save tenant info and tokens to localStorage
  if (response?.data?.tenant) {
    localStorage.setItem('tenant', JSON.stringify(response.data.tenant));
  }
  if (response?.data?.access_token) {
    localStorage.setItem('token', response.data.access_token);
  }
  if (response?.data?.refresh_token) {
    localStorage.setItem('refresh_token', response.data.refresh_token);
  }
  if (response?.data?.expires_at) {
    localStorage.setItem('expires_at', response.data.expires_at);
  }
  if (response?.data?.refresh_expires_at) {
    localStorage.setItem(
      'refresh_expires_at',
      response.data.refresh_expires_at
    );
  }

  return response?.data?.message || 'Tenant berhasil dibuat';
}

// Handler untuk error response
function onError(err: unknown): string {
  return (
    (err as { message?: string } | undefined)?.message ||
    'Gagal membuat tenant. Silakan coba lagi.'
  );
}
