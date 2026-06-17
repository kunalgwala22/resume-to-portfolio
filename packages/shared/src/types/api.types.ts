export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    details?: any;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  organizationId: string | null;
  isEmailVerified: boolean;
  createdAt: string | Date;
}

export interface AuthResponseData {
  user: UserProfile;
  accessToken: string;
  refreshToken?: string;
}
