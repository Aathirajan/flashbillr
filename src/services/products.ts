import { apiClient } from './api';
import { Product, PaginatedResponse } from '../types';

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  isActive?: boolean;
  featured?: boolean;
}

export interface CreateProductRequest {
  name: string;
  price: number;
  category: string;
  sku: string;
  stock?: number;
  isActive?: boolean;
  featured?: boolean;
  variants?: Array<{
    color?: string;
    size?: string;
    price?: number;
    stock?: number;
  }>;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

export interface UpdateInventoryRequest {
  stock: number;
}

export class ProductService {
  async getProducts(filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
    return apiClient.get<PaginatedResponse<Product>>('/products', filters);
  }

  async getProduct(id: string): Promise<Product> {
    return apiClient.get<Product>(`/products/${id}`);
  }

  async createProduct(data: CreateProductRequest): Promise<Product> {
    return apiClient.post<Product>('/products', data);
  }

  async updateProduct(id: string, data: UpdateProductRequest): Promise<Product> {
    return apiClient.put<Product>(`/products/${id}`, data);
  }

  async deleteProduct(id: string): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(`/products/${id}`);
  }

  async updateInventory(id: string, data: UpdateInventoryRequest): Promise<Product> {
    return apiClient.put<Product>(`/products/${id}/inventory`, data);
  }

  // Bulk operations
  async bulkCreateProducts(products: CreateProductRequest[]): Promise<{ products: Product[] }> {
    return apiClient.post<{ products: Product[] }>('/bulk/products', { products });
  }

  async bulkUpdateProducts(updates: Array<{ id: string; data: UpdateProductRequest }>): Promise<{ products: Product[] }> {
    return apiClient.put<{ products: Product[] }>('/bulk/products', { products: updates });
  }

  async bulkDeleteProducts(productIds: string[]): Promise<{ deleted: number }> {
    return apiClient.delete<{ deleted: number }>('/bulk/products', { productIds });
  }

  async bulkUpdateInventory(items: Array<{ productId: string; stock: number }>): Promise<{ updated: number }> {
    return apiClient.put<{ updated: number }>('/bulk/inventory', { items });
  }
}

export const productService = new ProductService();