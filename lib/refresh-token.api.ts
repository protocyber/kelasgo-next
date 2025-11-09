import { apiFetch } from '@/lib/api';

export type RefreshTokenResponse = {
  token: string;
  refresh_token: string;
  expires_at: string;
  refresh_expires_at: string;
};

export function refreshToken(refreshToken: string) {
  return apiFetch<RefreshTokenResponse>('/auth/refresh-token', {
    method: 'POST',
    json: { refresh_token: refreshToken },
    credentials: 'include',
  });
}
