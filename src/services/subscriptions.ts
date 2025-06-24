import { apiClient } from './api';
import { SubscriptionPlan } from '../types';

export interface Subscription {
  id: string;
  planId: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'cancelled' | 'expired';
  plan?: SubscriptionPlan;
}

export interface CreateSubscriptionRequest {
  planId: string;
  startDate: string;
  endDate: string;
}

export interface UpdateSubscriptionRequest {
  planId: string;
}

export interface SubscriptionPayment {
  id: string;
  amount: number;
  date: string;
  status: 'success' | 'failed' | 'pending';
}

export class SubscriptionService {
  async getSubscription(): Promise<Subscription> {
    return apiClient.get<Subscription>('/subscriptions');
  }

  async createSubscription(data: CreateSubscriptionRequest): Promise<Subscription> {
    return apiClient.post<Subscription>('/subscriptions', data);
  }

  async updateSubscription(data: UpdateSubscriptionRequest): Promise<Subscription> {
    return apiClient.put<Subscription>('/subscriptions', data);
  }

  async cancelSubscription(): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>('/subscriptions');
  }

  async getSubscriptionPayments(): Promise<{ payments: SubscriptionPayment[] }> {
    return apiClient.get<{ payments: SubscriptionPayment[] }>('/subscriptions/payments');
  }

  // SuperAdmin subscription plan management
  async getAllSubscriptionPlans(): Promise<{ plans: SubscriptionPlan[] }> {
    return apiClient.get<{ plans: SubscriptionPlan[] }>('/superadmin/subscription-plans');
  }

  async createSubscriptionPlan(data: Omit<SubscriptionPlan, 'id'>): Promise<SubscriptionPlan> {
    return apiClient.post<SubscriptionPlan>('/superadmin/subscription-plans', data);
  }

  async updateSubscriptionPlan(id: string, data: Partial<Omit<SubscriptionPlan, 'id'>>): Promise<SubscriptionPlan> {
    return apiClient.put<SubscriptionPlan>(`/superadmin/subscription-plans/${id}`, data);
  }
}

export const subscriptionService = new SubscriptionService();