// Registration API
export type RegistrationInput = {
  full_name: string;
  email: string;
  password: string;
};

export type RegistrationResponse = {
  id: string;
  email: string;
  name: string;
  // optionally token or other fields if backend returns them
  token?: string;
};

// Login API
export type LoginInput = {
  email: string;
  password: string;
};

export type UserInfo = {
  id: string;
  username: string;
  email: string;
  full_name: string;
};

export type LoginResponse = {
  token: string;
  refresh_token: string;
  expires_at: string;
  refresh_expires_at: string;
  user: UserInfo;
};
