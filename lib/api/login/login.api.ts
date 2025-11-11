import { apiFetch } from '@/lib/api';
import { LoginInput, LoginResponse } from '@/types';

export function login(input: LoginInput) {
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    json: input,
    credentials: 'include',
  });
}
