import { apiClient } from './client';

interface ApiResponse<T> {
  message?: string;
  detail?: string;
  data: T;
  error_code?: string;
  errors?: Record<string, string[]>;
  expires_in_seconds?: number;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface VerifyCodeDto {
  code: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

// Endpoints centralizados para editar fácilmente según el backend real
// Django requiere trailing slash cuando APPEND_SLASH está activo
const AUTH_ENDPOINTS = {
  login: '/auth/login/',
  register: '/auth/register/',
  verifyCode: '/auth/verify-code/',
  resendCode: '/auth/resend-code/',
  refresh: '/auth/refresh/',
  validate: '/auth/validate-token/',
  logout: '/auth/logout/',
};

export const authApi = {
  async login(dto: LoginDto): Promise<ApiResponse<AuthTokens>> {
    return apiClient.post<ApiResponse<AuthTokens>>(AUTH_ENDPOINTS.login, dto);
  },

  async register(dto: RegisterDto): Promise<ApiResponse<{ expires_in_seconds: number }>> {
    return apiClient.post<ApiResponse<{ expires_in_seconds: number }>>(AUTH_ENDPOINTS.register, dto);
  },

  async verifyCode(dto: VerifyCodeDto): Promise<ApiResponse<AuthTokens>> {
    return apiClient.post<ApiResponse<AuthTokens>>(AUTH_ENDPOINTS.verifyCode, dto);
  },

  async resendCode(): Promise<ApiResponse<{ expires_in_seconds: number }>> {
    return apiClient.post<ApiResponse<{ expires_in_seconds: number }>>(AUTH_ENDPOINTS.resendCode, {});
  },

  async refresh(): Promise<ApiResponse<AuthTokens>> {
    return apiClient.post<ApiResponse<AuthTokens>>(AUTH_ENDPOINTS.refresh, {});
  },

  async validateToken(): Promise<ApiResponse<{ detail: string }>> {
    return apiClient.get<ApiResponse<{ detail: string }>>(AUTH_ENDPOINTS.validate);
  },

  async logout(): Promise<ApiResponse<{ detail: string }>> {
    return apiClient.post<ApiResponse<{ detail: string }>>(AUTH_ENDPOINTS.logout, {});
  },
};
