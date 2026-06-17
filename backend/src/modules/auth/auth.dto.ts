import { RegisterInput, LoginInput, UserProfile } from '@portfolioverse/shared';

export type RegisterDTO = RegisterInput;
export type LoginDTO = LoginInput;

export interface AuthResponse {
  user: UserProfile;
  accessToken: string;
  refreshToken: string;
}
