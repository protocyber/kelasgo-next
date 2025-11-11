import { register as registrationApi } from '@/lib/api/registration/registration.api';
import { RegistrationInput } from '@/types';
import { useMutation } from '@tanstack/react-query';

export function useRegistrationFunc(params: {
  onSuccess: () => void;
  onError: (error: string) => void;
}) {
  const mutation = useMutation({
    mutationFn: async (values: RegistrationInput) => {
      return registrationApi(values);
    },
    onSuccess: params.onSuccess,
    onError: params.onError,
  });

  return {
    mutation,
  };
}
