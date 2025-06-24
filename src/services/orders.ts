import { apiClient } from './api';
import { Order, PaginatedResponse, Address } from '../types';

export interface OrderFilters {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  customerId?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateOrderRequest {
  customerId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  paymentMethod: string;
  shippingAddress: Address;
  note?: string;
}

export interface UpdateOrderStatusRequest {
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
}

export class OrderService {
  async getOrders(filters: OrderFilters = {}): Promise<PaginatedResponse<Order>> {
    return apiClient.get<PaginatedResponse<Order>>('/orders', filters);
  }

  async getOrder(id: string): Promise<Order> {
    return apiClient.get<Order>(`/orders/${id}`);
  }

  async createOrder(data: CreateOrderRequest): Promise<Order> {
    return apiClient.post<Order>('/orders', data);
  }

  async updateOrderStatus(id: string, data: UpdateOrderStatusRequest): Promise<Order> {
    return apiClient.put<Order>(`/orders/${id}/status`, data);
  }

  // Bulk operations
  async bulkUpdateOrderStatus(orders: Array<{ orderId: string; status: string }>): Promise<{ updated: number }> {
    return apiClient.put<{ updated: number }>('/bulk/orders/status', { orders });
  }

  // PDF generation
  async generateInvoicePDF(orderId: string): Promise<{ url: string }> {
    return apiClient.get<{ url: string }>(`/pdf/orders/${orderId}/invoice`);
  }

  async generateShippingLabelPDF(orderId: string): Promise<{ url: string }> {
    return apiClient.get<{ url: string }>(`/pdf/orders/${orderId}/shipping-label`);
  }
}

export const orderService = new OrderService();