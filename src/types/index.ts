export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'superadmin';
  storeId?: string;
}

export interface Store {
  id: string;
  name: string;
  domain: string;
  description?: string;
  logo?: string;
  email: string;
  planId: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  sku: string;
  stock: number;
  isActive: boolean;
  featured: boolean;
  variants?: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  color?: string;
  size?: string;
  price?: number;
  stock?: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  shippingAddress: Address;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  addresses: Address[];
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
}

export interface Address {
  id: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface DashboardMetrics {
  sales: number;
  orders: number;
  customers: number;
  inventory: number;
  todaysSales: number;
  todaysOrders: number;
  salesGrowth: number;
  ordersGrowth: number;
}

export interface AnalyticsData {
  daily: { date: string; sales: number; orders: number }[];
  categories: { name: string; value: number }[];
  topProducts: { name: string; sales: number }[];
}

export interface Webhook {
  id: string;
  event: string;
  url: string;
  active: boolean;
  createdAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: 'MONTHLY' | 'YEARLY';
  features: Record<string, any>;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}