import { apiFetch } from '@/lib/api';
import { RegistrationInput, RegistrationResponse } from '@/types';

export function register(input: RegistrationInput) {
  return apiFetch<RegistrationResponse>('/auth/register', {
    method: 'POST',
    json: input,
    credentials: 'include',
  });
}
