export type SignUpPayload = {
  email: string;
  password: string;
  name?: string;
};

export type SignInPayload = {
  email: string;
  password: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken?: string;
  user?: { id: string; email: string; name?: string };
};
