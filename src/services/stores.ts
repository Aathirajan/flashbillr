import { apiClient } from './api';
import { Store, DashboardMetrics, PaginatedResponse } from '../types';

export interface CreateStoreRequest {
  name: string;
  domain: string;
  description?: string;
  logo?: string;
  email: string;
  planId: string;
  adminEmail?: string;
  adminName?: string;
  adminPassword?: string;
}

export interface UpdateStoreRequest extends Partial<Omit<CreateStoreRequest, 'adminEmail' | 'adminName' | 'adminPassword'>> {}

export interface UpdateStoreStatusRequest {
  status: 'active' | 'inactive' | 'suspended';
}

export class StoreService {
  // Store dashboard and profile (for admins)
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    return apiClient.get<DashboardMetrics>('/stores/dashboard');
  }

  async getStoreProfile(): Promise<Store> {
    return apiClient.get<Store>('/stores/profile');
  }

  async updateStoreProfile(data: UpdateStoreRequest): Promise<Store> {
    return apiClient.put<Store>('/stores/profile', data);
  }

  // SuperAdmin store management
  async getAllStores(): Promise<PaginatedResponse<Store>> {
    return apiClient.get<PaginatedResponse<Store>>('/superadmin/stores');
  }

  async getStore(id: string): Promise<Store> {
    return apiClient.get<Store>(`/superadmin/stores/${id}`);
  }

  async createStore(data: CreateStoreRequest): Promise<Store> {
    return apiClient.post<Store>('/superadmin/stores', data);
  }

  async updateStore(id: string, data: UpdateStoreRequest): Promise<Store> {
    return apiClient.put<Store>(`/superadmin/stores/${id}`, data);
  }

  async updateStoreStatus(id: string, data: UpdateStoreStatusRequest): Promise<Store> {
    return apiClient.put<Store>(`/system/stores/${id}/status`, data);
  }
}

export const storeService = new StoreService();