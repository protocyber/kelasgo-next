import { z } from 'zod';
import { createTenant } from './create-tenant.api';
import { CreateTenantInput } from '@/types';

// Schema validation untuk form
export const createTenantSchema = z.object({
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

export type CreateTenantFormData = z.infer<typeof createTenantSchema>;

// Transform form data ke format API
export function transformFormDataToInput(
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
export async function createTenantAction(input: CreateTenantInput) {
  return createTenant(input);
}

// Handler untuk success response
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handleTenantCreationSuccess(response: any) {
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
export function handleTenantCreationError(err: unknown): string {
  return (
    (err as { message?: string } | undefined)?.message ||
    'Gagal membuat tenant. Silakan coba lagi.'
  );
}
