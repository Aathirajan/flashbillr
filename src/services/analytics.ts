import { apiClient } from './api';
import { AnalyticsData } from '../types';

export interface DailySalesData {
  date: string;
  totalSales: number;
}

export interface InventoryItem {
  productId: string;
  stock: number;
}

export interface CustomerSegment {
  segment: string;
  count: number;
}

export interface AnalyticsHistoryFilters {
  startDate?: string;
  endDate?: string;
}

export class AnalyticsService {
  async getDailySales(): Promise<{ data: DailySalesData[] }> {
    return apiClient.get<{ data: DailySalesData[] }>('/analytics/sales/daily');
  }

  async getInventoryReport(): Promise<{ items: InventoryItem[] }> {
    return apiClient.get<{ items: InventoryItem[] }>('/analytics/inventory');
  }

  async getCustomerAnalytics(): Promise<{ segments: CustomerSegment[] }> {
    return apiClient.get<{ segments: CustomerSegment[] }>('/analytics/customers');
  }

  async getAnalyticsHistory(filters: AnalyticsHistoryFilters = {}): Promise<{ data: DailySalesData[] }> {
    return apiClient.get<{ data: DailySalesData[] }>('/analytics/history', filters);
  }

  // Transform API data to match component expectations
  async getAnalyticsData(): Promise<AnalyticsData> {
    const [dailySales, inventory, customers] = await Promise.all([
      this.getDailySales(),
      this.getInventoryReport(),
      this.getCustomerAnalytics()
    ]);

    // Transform daily sales data
    const daily = dailySales.data.map(item => ({
      date: item.date,
      sales: item.totalSales,
      orders: Math.floor(item.totalSales / 100) // Estimate orders from sales
    }));

    // Transform customer segments to categories
    const categories = customers.segments.map(segment => ({
      name: segment.segment,
      value: segment.count
    }));

    // Create mock top products from inventory (in real app, this would be a separate endpoint)
    const topProducts = inventory.items.slice(0, 5).map((item, index) => ({
      name: `Product ${item.productId}`,
      sales: item.stock * (5 - index) // Mock sales based on stock
    }));

    return {
      daily,
      categories,
      topProducts
    };
  }
}

export const analyticsService = new AnalyticsService();