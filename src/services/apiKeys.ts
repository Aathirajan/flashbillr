import { apiClient } from './api';

export interface ApiKey {
  id: string;
  name: string;
  storeId?: string;
  key: string;
  active: boolean;
  createdAt: string;
  lastUsed?: string;
}

export interface CreateApiKeyRequest {
  name: string;
  storeId?: string;
}

export class ApiKeyService {
  async getApiKeys(): Promise<ApiKey[]> {
    return apiClient.get<ApiKey[]>('/api-keys');
  }

  async createApiKey(data: CreateApiKeyRequest): Promise<{ apiKey: string }> {
    return apiClient.post<{ apiKey: string }>('/api-keys', data);
  }

  async revokeApiKey(id: string): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(`/api-keys/${id}`);
  }

  async revokeAllStoreApiKeys(storeId: string): Promise<{ success: boolean }> {
    return apiClient.post<{ success: boolean }>('/api-keys/revoke-all', { storeId });
  }
}

export const apiKeyService = new ApiKeyService();