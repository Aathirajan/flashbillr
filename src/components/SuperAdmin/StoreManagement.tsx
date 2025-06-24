import React, { useState } from 'react';
import { Search, Plus, Edit, Eye, Users, DollarSign, Calendar, AlertCircle, CheckCircle, XCircle, Crown, Store as StoreIcon } from 'lucide-react';
import { Card } from '../Common/Card';
import { Button } from '../Common/Button';
import { Modal } from '../Common/Modal';
import { useApi, useAsyncAction } from '../../hooks/useApi';
import { storeService } from '../../services/stores';
import type { Store } from '../../types';


export const StoreManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    plan: '',
  });

  const { data: storesData, loading, refetch } = useApi(
    () => storeService.getAllStores(),
    []
  );

  const { execute: updateStoreStatus } = useAsyncAction(
    async (storeId: string, status: 'active' | 'inactive' | 'suspended') => {
      await storeService.updateStoreStatus(storeId, { status });
      refetch();
    }
  );

  const handleViewStore = (store: Store) => {
    setSelectedStore(store);
    setIsViewModalOpen(true);
  };

  const handleStatusChange = async (store: Store, newStatus: 'active' | 'inactive' | 'suspended') => {
    if (window.confirm(`Are you sure you want to ${newStatus} this store?`)) {
      try {
        await updateStoreStatus(store.id, newStatus);
      } catch (error) {
        console.error('Failed to update store status:', error);
      }
    }
  };

  const stores: Store[] = storesData?.data || [];
  const total = storesData?.total || 0;

  const statusConfig = {
    active: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Active' },
    inactive: { color: 'bg-gray-100 text-gray-800', icon: XCircle, label: 'Inactive' },
    suspended: { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Suspended' },
  };

  if (loading && !storesData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Store Management</h1>
          <p className="text-gray-600 mt-1">{total} stores across the platform</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Store
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card padding="sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-4">
              <StoreIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Stores</p>
              <p className="text-2xl font-bold text-gray-900">247</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-4">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$1.2M</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">12.5K</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-4">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">New This Month</p>
              <p className="text-2xl font-bold text-gray-900">23</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search stores by name, domain, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
            <select
              value={filters.plan}
              onChange={(e) => setFilters(prev => ({ ...prev, plan: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="">All Plans</option>
              <option value="basic">Basic</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
        </div>

        {stores.length === 0 ? (
          <div className="text-center py-12">
            <StoreIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No stores found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search criteria' : 'Create your first store to get started'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Store</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Plan</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Revenue</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Created</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: '1', name: 'TechStore Pro', domain: 'techstore.com', email: 'admin@techstore.com', plan: 'Pro', status: 'active', revenue: 45000, created: '2024-01-15' },
                  { id: '2', name: 'Fashion Hub', domain: 'fashionhub.com', email: 'owner@fashionhub.com', plan: 'Enterprise', status: 'active', revenue: 78000, created: '2024-01-10' },
                  { id: '3', name: 'Book Corner', domain: 'bookcorner.com', email: 'info@bookcorner.com', plan: 'Basic', status: 'inactive', revenue: 12000, created: '2024-01-08' },
                ].map((store) => {
                  const statusInfo = statusConfig[store.status as keyof typeof statusConfig];
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <tr key={store.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg mr-3 flex items-center justify-center">
                            <StoreIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{store.name}</div>
                            <div className="text-sm text-gray-500">{store.domain}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          store.plan === 'Enterprise' ? 'bg-purple-100 text-purple-800' :
                          store.plan === 'Pro' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {store.plan === 'Enterprise' && <Crown className="w-3 h-3 mr-1" />}
                          {store.plan}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">${store.revenue.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">This month</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-900">
                          {new Date(store.created).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleViewStore(store as any)}
                            className="text-gray-600 hover:text-primary-600 transition-colors duration-200"
                            title="View Store"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                            title="Edit Store"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {store.status === 'active' ? (
                            <button 
                              onClick={() => handleStatusChange(store as any, 'suspended')}
                              className="text-gray-600 hover:text-red-600 transition-colors duration-200"
                              title="Suspend Store"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleStatusChange(store as any, 'active')}
                              className="text-gray-600 hover:text-green-600 transition-colors duration-200"
                              title="Activate Store"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* View Store Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Store Details"
        size="xl"
      >
        {selectedStore && <StoreDetails store={selectedStore} />}
      </Modal>

      {/* Create Store Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Store"
        size="lg"
      >
        <CreateStoreForm onClose={() => setIsCreateModalOpen(false)} onSuccess={refetch} />
      </Modal>
    </div>
  );
};

// Store Details Component
const StoreDetails: React.FC<{ store: Store }> = ({ store }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding="sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Store Information</h4>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Store Name</label>
              <p className="text-gray-900">{store.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Domain</label>
              <p className="text-gray-900">{store.domain}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-900">{store.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Description</label>
              <p className="text-gray-900">{store.description || 'No description provided'}</p>
            </div>
          </div>
        </Card>

        <Card padding="sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Subscription & Status</h4>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Plan</label>
              <p className="text-gray-900">{store.planId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                store.status === 'active' ? 'bg-green-100 text-green-800' :
                store.status === 'suspended' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {store.status}
              </span>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Created</label>
              <p className="text-gray-900">{new Date(store.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Last Updated</label>
              <p className="text-gray-900">{new Date(store.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Create Store Form Component
const CreateStoreForm: React.FC<{ onClose: () => void; onSuccess: () => void }> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    email: '',
    description: '',
    planId: 'basic',
    adminName: '',
    adminEmail: '',
    adminPassword: '',
  });

  const { execute: createStore, loading, error } = useAsyncAction(
    async (data: any) => {
      await storeService.createStore(data);
      onSuccess();
      onClose();
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createStore(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Store Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            placeholder="Enter store name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Domain *
          </label>
          <input
            type="text"
            required
            value={formData.domain}
            onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            placeholder="example.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Store Email *
        </label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          placeholder="store@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          rows={3}
          placeholder="Store description"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subscription Plan *
        </label>
        <select
          required
          value={formData.planId}
          onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        >
          <option value="basic">Basic - $29/month</option>
          <option value="pro">Pro - $79/month</option>
          <option value="enterprise">Enterprise - $199/month</option>
        </select>
      </div>

      <div className="border-t pt-4">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Admin Account</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Name *
            </label>
            <input
              type="text"
              required
              value={formData.adminName}
              onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="Admin full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Email *
            </label>
            <input
              type="email"
              required
              value={formData.adminEmail}
              onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="admin@example.com"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Admin Password *
          </label>
          <input
            type="password"
            required
            value={formData.adminPassword}
            onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            placeholder="Secure password"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={loading}>
          Create Store
        </Button>
      </div>
    </form>
  );
};