import { apiClient } from './api';
import { User } from '../types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  storeId: string;
  role: 'admin' | 'manager';
}

export class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    const payload: LoginRequest = { email, password };
    
    // Single login endpoint - backend determines role and redirects appropriately
    const response = await apiClient.post<LoginResponse>('/auth/login', payload);
    
    if (response.accessToken) {
      apiClient.setToken(response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('userData', JSON.stringify(response.user));
    }
    
    return response;
  }

  async signup(data: SignupRequest): Promise<User> {
    return apiClient.post<User>('/auth/signup', data);
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      apiClient.clearToken();
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
    }
  }

  async refreshToken(): Promise<{ accessToken: string }> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<{ accessToken: string }>('/auth/refresh', {
      refreshToken,
    });

    if (response.accessToken) {
      apiClient.setToken(response.accessToken);
    }

    return response;
  }

  getCurrentUser(): User | null {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }
}

export const authService = new AuthService();