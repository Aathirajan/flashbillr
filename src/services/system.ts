import { apiClient } from './api';

export interface SystemConfig {
  name: string;
  version: string;
  globalSettings: Record<string, any>;
  maintenanceMode: boolean;
}

export interface SystemMetrics {
  totalStores: number;
  activeStores: number;
  totalRevenue: number;
  totalUsers: number;
}

export interface ActivityLog {
  id: string;
  action: string;
  userId: string;
  storeId?: string;
  timestamp: string;
  details?: Record<string, any>;
}

export interface CreateSuperAdminRequest {
  email: string;
  name: string;
}

export class SystemService {
  async updateSystemConfig(config: Partial<SystemConfig>): Promise<{ success: boolean; config: SystemConfig }> {
    return apiClient.put<{ success: boolean; config: SystemConfig }>('/system/config', config);
  }

  async getSystemMetrics(): Promise<SystemMetrics> {
    return apiClient.get<SystemMetrics>('/system/metrics');
  }

  async getActivityLogs(filters?: { action?: string; storeId?: string; userId?: string; startDate?: string; endDate?: string }): Promise<ActivityLog[]> {
    return apiClient.get<ActivityLog[]>('/system/activity-logs', filters);
  }

  async createSuperAdmin(data: CreateSuperAdminRequest): Promise<{ id: string; email: string }> {
    return apiClient.post<{ id: string; email: string }>('/system/super-admins', data);
  }
}

export const systemService = new SystemService();