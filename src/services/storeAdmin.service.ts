import { apiClient } from './api';
import { 
  CreateStoreAdminDto, 
  SetupPasswordDto, 
  LoginDto, 
  AuthResponse,
  StoreAdminResponse,
  StoreAdminListResponse
} from '../types/store-admin.types';

export const storeAdminService = {
  /**
   * Get list of store admins (SuperAdmin only)
   */
  async getStoreAdmins(): Promise<StoreAdminListResponse> {
    return apiClient.get<StoreAdminListResponse>('/superadmin/store-admins');
  },

  /**
   * Create a new store admin (SuperAdmin only)
   */
  async createStoreAdmin(data: CreateStoreAdminDto): Promise<StoreAdminResponse> {
    return apiClient.post<StoreAdminResponse>('/superadmin/store-admins', data);
  },

  /**
   * Update an existing store admin (SuperAdmin only)
   */
  async updateStoreAdmin(id: string, data: import('../types/store-admin.types').UpdateStoreAdminDto): Promise<StoreAdminResponse> {
    return apiClient.patch<StoreAdminResponse>(`/superadmin/store-admins/${id}`, data);
  },

  /**
   * Delete a store admin (SuperAdmin only)
   */
  async deleteStoreAdmin(id: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete<{ success: boolean; message: string }>(`/superadmin/store-admins/${id}`);
  },

  /**
   * Setup password for new store admin
   */
  async setupPassword(data: SetupPasswordDto): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/setup-password', data);
  },

  /**
   * Login for all user types
   */
  async login(data: LoginDto): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/login', data);
  },

  /**
   * Store tokens in localStorage (consider HTTP-only cookies in production)
   */
  storeTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },

  /**
   * Retrieve stored tokens from localStorage
   */
  getTokens(): { accessToken: string | null; refreshToken: string | null } {
    return {
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken'),
    };
  },

  /**
   * Clear stored tokens (logout)
   */
  clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};

export default storeAdminService;
