import { apiClient } from './api';
import { Webhook } from '../types';

export interface CreateWebhookRequest {
  event: string;
  url: string;
  active: boolean;
}

export interface UpdateWebhookRequest extends Partial<CreateWebhookRequest> {}

export interface WebhookLog {
  id: string;
  status: 'delivered' | 'failed' | 'pending';
  timestamp: string;
  response?: string;
  error?: string;
}

export class WebhookService {
  async getWebhooks(): Promise<{ webhooks: Webhook[]; total: number }> {
    return apiClient.get<{ webhooks: Webhook[]; total: number }>('/webhooks');
  }

  async createWebhook(data: CreateWebhookRequest): Promise<Webhook> {
    return apiClient.post<Webhook>('/webhooks', data);
  }

  async updateWebhook(id: string, data: UpdateWebhookRequest): Promise<Webhook> {
    return apiClient.put<Webhook>(`/webhooks/${id}`, data);
  }

  async deleteWebhook(id: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/webhooks/${id}`);
  }

  async getWebhookLogs(id: string): Promise<{ logs: WebhookLog[] }> {
    return apiClient.get<{ logs: WebhookLog[] }>(`/webhooks/${id}/logs`);
  }

  async retryWebhookDelivery(webhookId: string, logId: string): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(`/webhooks/${webhookId}/logs/${logId}/retry`);
  }

  async getAvailableEvents(): Promise<{ events: string[] }> {
    return apiClient.get<{ events: string[] }>('/webhooks/events');
  }

  async getEventExample(event: string): Promise<{ example: any }> {
    return apiClient.get<{ example: any }>(`/webhooks/events/${event}/example`);
  }
}

export const webhookService = new WebhookService();