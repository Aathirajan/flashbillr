import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Edit, Truck, Package, CheckCircle, XCircle, AlertCircle, Calendar, User, DollarSign, MapPin } from 'lucide-react';
import { Card } from '../Common/Card';
import { Button } from '../Common/Button';
import { Modal } from '../Common/Modal';
import { Order } from '../../types';
import { orderService } from '../../services/orders';
import { useApi, useAsyncAction } from '../../hooks/useApi';
import { clsx } from 'clsx';

interface OrderListProps {
  orders?: Order[];
}

const statusConfig = {
  PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle, label: 'Pending' },
  PROCESSING: { color: 'bg-blue-100 text-blue-800', icon: Package, label: 'Processing' },
  SHIPPED: { color: 'bg-purple-100 text-purple-800', icon: Truck, label: 'Shipped' },
  DELIVERED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Delivered' },
  CANCELLED: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Cancelled' },
};

export const OrderList: React.FC<OrderListProps> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: '',
    status: '',
    startDate: '',
    endDate: '',
  });

  const { data: ordersData, loading, error, refetch } = useApi(
    () => orderService.getOrders(filters),
    [filters]
  );

  const { execute: updateOrderStatus, loading: updateLoading } = useAsyncAction(
    async (orderId: string, status: string) => {
      await orderService.updateOrderStatus(orderId, { status: status as any });
      refetch();
      setIsStatusModalOpen(false);
    }
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const handleStatusUpdate = (order: Order) => {
    setSelectedOrder(order);
    setIsStatusModalOpen(true);
  };

  const handleStatusChange = async (status: string) => {
    if (selectedOrder) {
      await updateOrderStatus(selectedOrder.id, status);
    }
  };

  if (loading && !ordersData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Orders</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={refetch}>Try Again</Button>
      </Card>
    );
  }

  const orders = ordersData?.data || [];
  const total = ordersData?.total || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
          <p className="text-gray-600 mt-1">{total} orders total</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search orders by ID, customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value, page: 1 }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value, page: 1 }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search criteria' : 'Orders will appear here once customers start placing them'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Order</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Total</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Payment</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const statusInfo = statusConfig[order.status];
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg mr-3 flex items-center justify-center">
                            <Package className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">#{order.id}</div>
                            <div className="text-sm text-gray-500">{order.items.length} items</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <div className="font-medium text-gray-900">{order.customerName}</div>
                            <div className="text-sm text-gray-500">ID: {order.customerId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="font-medium text-gray-900">${order.total.toFixed(2)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-600">{order.paymentMethod}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleViewOrder(order)}
                            className="text-gray-600 hover:text-primary-600 transition-colors duration-200"
                            title="View Order"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(order)}
                            className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                            title="Update Status"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {total > filters.limit && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing {((filters.page - 1) * filters.limit) + 1} to {Math.min(filters.page * filters.limit, total)} of {total} results
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={filters.page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={filters.page * filters.limit >= total}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* View Order Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Order Details"
        size="xl"
      >
        {selectedOrder && <OrderDetails order={selectedOrder} />}
      </Modal>

      {/* Update Status Modal */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title="Update Order Status"
        size="md"
      >
        {selectedOrder && (
          <StatusUpdateForm 
            order={selectedOrder} 
            onUpdate={handleStatusChange}
            loading={updateLoading}
            onCancel={() => setIsStatusModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};

// Order Details Component
const OrderDetails: React.FC<{ order: Order }> = ({ order }) => {
  const statusInfo = statusConfig[order.status];
  const StatusIcon = statusInfo.icon;

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Order #{order.id}</h3>
          <p className="text-sm text-gray-500 mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
          </p>
        </div>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
          <StatusIcon className="w-4 h-4 mr-2" />
          {statusInfo.label}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Information */}
        <Card padding="sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h4>
          <div className="space-y-2">
            <div className="flex items-center">
              <User className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-gray-900">{order.customerName}</span>
            </div>
            <div className="text-sm text-gray-600">Customer ID: {order.customerId}</div>
          </div>
        </Card>

        {/* Payment Information */}
        <Card padding="sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Payment Information</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-medium text-gray-900">{order.paymentMethod}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-semibold text-lg text-gray-900">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Shipping Address */}
      <Card padding="sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">Shipping Address</h4>
        <div className="flex items-start">
          <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-1" />
          <div className="text-gray-900">
            <div>{order.shippingAddress.line1}</div>
            {order.shippingAddress.line2 && <div>{order.shippingAddress.line2}</div>}
            <div>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
            </div>
            <div>{order.shippingAddress.country}</div>
            {order.shippingAddress.phone && (
              <div className="text-sm text-gray-600 mt-1">Phone: {order.shippingAddress.phone}</div>
            )}
          </div>
        </div>
      </Card>

      {/* Order Items */}
      <Card padding="sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">Order Items</h4>
        <div className="space-y-3">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-100 rounded-lg mr-3 flex items-center justify-center">
                  <Package className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{item.productName}</div>
                  <div className="text-sm text-gray-500">Product ID: {item.productId}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900">${item.price.toFixed(2)} × {item.quantity}</div>
                <div className="text-sm text-gray-500">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Order Note */}
      {order.note && (
        <Card padding="sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Order Note</h4>
          <p className="text-gray-700">{order.note}</p>
        </Card>
      )}
    </div>
  );
};

// Status Update Form Component
const StatusUpdateForm: React.FC<{
  order: Order;
  onUpdate: (status: string) => void;
  loading: boolean;
  onCancel: () => void;
}> = ({ order, onUpdate, loading, onCancel }) => {
  const [selectedStatus, setSelectedStatus] = useState(order.status);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(selectedStatus);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Update Status for Order #{order.id}
        </label>
        <div className="space-y-2">
          {Object.entries(statusConfig).map(([status, config]) => {
            const Icon = config.icon;
            return (
              <label key={status} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="status"
                  value={status}
                  checked={selectedStatus === status}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="mr-3"
                />
                <Icon className="w-4 h-4 mr-2 text-gray-600" />
                <span className="font-medium text-gray-900">{config.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={loading} disabled={selectedStatus === order.status}>
          Update Status
        </Button>
      </div>
    </form>
  );
};