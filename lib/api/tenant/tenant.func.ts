import { CreateTenantInput } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { createTenant } from './tenant.api';

export function useTenantFunc(params: {
  onSuccess: (response: unknown) => void;
  onError: (error: string) => void;
}) {
  const createTenantMutation = useMutation({
    mutationFn: async (values: CreateTenantInput) => {
      return createTenant(values);
    },
    onSuccess: params.onSuccess,
    onError: params.onError,
  });

  return {
    createTenantMutation,
  };
}
