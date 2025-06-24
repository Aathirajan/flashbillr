import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from 'lucide-react';
import { Card } from '../Common/Card';
import { DashboardMetrics } from '../../types';
import { useApi } from '../../hooks/useApi';
import { storeService } from '../../services/stores';

interface DashboardCardsProps {
  metrics?: DashboardMetrics;
}

export const DashboardCards: React.FC<DashboardCardsProps> = ({ metrics: propMetrics }) => {
  const { data: metrics, loading, error } = useApi(
    () => storeService.getDashboardMetrics(),
    []
  );

  const metricsData = propMetrics || metrics;

  if (loading && !metricsData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error && !metricsData) {
    return (
      <Card className="mb-8">
        <div className="text-center py-4">
          <p className="text-red-600">Failed to load dashboard metrics</p>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
        </div>
      </Card>
    );
  }

  if (!metricsData) {
    return null;
  }

  const cards = [
    {
      title: 'Total Sales',
      value: `$${metricsData.sales.toLocaleString()}`,
      change: `+${metricsData.salesGrowth}%`,
      changeType: 'increase' as const,
      icon: DollarSign,
      gradient: 'from-emerald-500 to-teal-500',
      description: `$${metricsData.todaysSales.toLocaleString()} today`
    },
    {
      title: 'Orders',
      value: metricsData.orders.toLocaleString(),
      change: `+${metricsData.ordersGrowth}%`,
      changeType: 'increase' as const,
      icon: ShoppingCart,
      gradient: 'from-blue-500 to-indigo-500',
      description: `${metricsData.todaysOrders} today`
    },
    {
      title: 'Customers',
      value: metricsData.customers.toLocaleString(),
      change: '+12%',
      changeType: 'increase' as const,
      icon: Users,
      gradient: 'from-purple-500 to-pink-500',
      description: 'Active customers'
    },
    {
      title: 'Inventory',
      value: metricsData.inventory.toLocaleString(),
      change: '-5%',
      changeType: 'decrease' as const,
      icon: Package,
      gradient: 'from-orange-500 to-red-500',
      description: 'Items in stock'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1 group-hover:text-primary-600 transition-colors duration-200">
                  {card.value}
                </p>
                <div className="flex items-center mt-2">
                  {card.changeType === 'increase' ? (
                    <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    card.changeType === 'increase' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {card.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{card.description}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-r ${card.gradient} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};