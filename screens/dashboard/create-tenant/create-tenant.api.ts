import { apiFetch } from '@/lib/api';
import { CreateTenantInput, TenantResponse } from '@/types';

export function createTenant(input: CreateTenantInput) {
  return apiFetch<TenantResponse>('/auth/register-tenant-trial', {
    method: 'POST',
    json: input,
    credentials: 'include',
  });
}
