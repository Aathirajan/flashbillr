import { apiClient } from './api';
import { Customer, PaginatedResponse, Address } from '../types';

export interface CustomerFilters {
  page?: number;
  limit?: number;
  search?: string;
  email?: string;
  phone?: string;
}

export interface CreateCustomerRequest {
  name: string;
  email: string;
  phone?: string;
}

export interface UpdateCustomerRequest extends Partial<CreateCustomerRequest> {}

export interface CreateAddressRequest {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export class CustomerService {
  async getCustomers(filters: CustomerFilters = {}): Promise<PaginatedResponse<Customer>> {
    return apiClient.get<PaginatedResponse<Customer>>('/customers', filters);
  }

  async getCustomer(id: string): Promise<Customer> {
    return apiClient.get<Customer>(`/customers/${id}`);
  }

  async createCustomer(data: CreateCustomerRequest): Promise<Customer> {
    return apiClient.post<Customer>('/customers', data);
  }

  async updateCustomer(id: string, data: UpdateCustomerRequest): Promise<Customer> {
    return apiClient.put<Customer>(`/customers/${id}`, data);
  }

  async deleteCustomer(id: string): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(`/customers/${id}`);
  }

  // Address management
  async addCustomerAddress(customerId: string, data: CreateAddressRequest): Promise<Address> {
    return apiClient.post<Address>(`/customers/${customerId}/addresses`, data);
  }

  async updateCustomerAddress(customerId: string, addressId: string, data: Partial<CreateAddressRequest>): Promise<Address> {
    return apiClient.put<Address>(`/customers/${customerId}/addresses/${addressId}`, data);
  }

  async deleteCustomerAddress(customerId: string, addressId: string): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(`/customers/${customerId}/addresses/${addressId}`);
  }

  // Bulk operations
  async bulkImportCustomers(customers: CreateCustomerRequest[]): Promise<{ customers: Customer[] }> {
    return apiClient.post<{ customers: Customer[] }>('/bulk/customers', { customers });
  }
}

export const customerService = new CustomerService();