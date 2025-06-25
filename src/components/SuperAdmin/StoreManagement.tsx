import React, { useState } from 'react';
import { Search, Plus, Store as StoreIcon, UserCog } from 'lucide-react';
import { Card } from '../Common/Card';
import { Button } from '../Common/Button';
import { Modal } from '../Common/Modal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../Common/Tabs';
import { useApi, useAsyncAction } from '../../hooks/useApi';
import { storeService } from '../../services/stores';
import { StoreAdminsDashboard } from './StoreAdminsDashboard';
import type { Store } from '../../types';

// Store Details Component
const StoreDetails: React.FC<{ store: Store }> = ({ store }) => {
  // Helper to get plan name from planId
  const getPlanName = (planId: string) => {
    const plans: Record<string, string> = {
      'plan_free': 'Free',
      'plan_pro': 'Pro',
      'plan_enterprise': 'Enterprise',
      'plan_basic': 'Basic'
    };
    return plans[planId] || planId;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-blue-100 rounded-lg">
          <StoreIcon className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-medium">{store.name}</h3>
          <p className="text-sm text-gray-500">{store.domain}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Status</p>
          <div className="flex items-center mt-1">
            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
              store.status === 'active' ? 'bg-green-500' : 
              store.status === 'inactive' ? 'bg-yellow-500' : 'bg-red-500'
            }`}></span>
            <span className="capitalize">{store.status}</span>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Plan</p>
          <p className="capitalize">{getPlanName(store.planId)}</p>
        </div>
      </div>
    
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Store Information</h4>
        <div className="space-y-2 text-sm">
          <p><span className="text-gray-500">Email:</span> {store.email}</p>
          <p><span className="text-gray-500">Created:</span> {new Date(store.createdAt).toLocaleDateString()}</p>
        </div>
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
    phone: '',
    address: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // TODO: Replace with actual API call
      // await storeService.createStore(formData);
      console.log('Creating store with:', formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create store');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
            https://
          </span>
          <input
            type="text"
            name="domain"
            value={formData.domain}
            onChange={handleChange}
            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="yourstore"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading || !formData.name || !formData.domain || !formData.email}
        >
          {isLoading ? 'Creating...' : 'Create Store'}
        </Button>
      </div>
    </form>
  );
};

export const StoreManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('stores');
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

  // Status configuration is now handled directly in the component

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
          <p className="text-gray-600 mt-1">
            {activeTab === 'stores' 
              ? `${total} stores across the platform`
              : 'Manage store administrators and permissions'}
          </p>
        </div>
        {activeTab === 'stores' && (
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Store
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="stores">
            <StoreIcon className="w-4 h-4 mr-2" />
            Stores
          </TabsTrigger>
          <TabsTrigger value="admins">
            <UserCog className="w-4 h-4 mr-2" />
            Store Admins
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stores">
          {/* Stores content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Stores</p>
                  <p className="text-2xl font-semibold text-gray-900">{total}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <StoreIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stores.filter(s => s.status === 'active').length}
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-green-600" />
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Inactive</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stores.filter(s => s.status === 'inactive').length}
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-yellow-600" />
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Suspended</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stores.filter(s => s.status === 'suspended').length}
                  </p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-red-600" />
                </div>
              </div>
            </Card>
          </div>

          <Card className="mt-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="relative w-full md:w-64 mb-4 md:mb-0">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search stores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <select
                  className="block w-32 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
                <select
                  className="block w-32 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filters.plan}
                  onChange={(e) => setFilters({ ...filters, plan: e.target.value })}
                >
                  <option value="">All Plans</option>
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Store
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stores.map((store) => (
                    <tr key={store.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white">
                              {store.name.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{store.name}</div>
                            <div className="text-sm text-gray-500">{store.domain}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          store.planId.includes('enterprise') ? 'bg-purple-100 text-purple-800' :
                          store.planId.includes('pro') ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {store.planId.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          store.status === 'active' ? 'bg-green-100 text-green-800' :
                          store.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {store.status.charAt(0).toUpperCase() + store.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${'0'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(store.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewStore(store)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </button>
                          <button className="text-indigo-600 hover:text-indigo-900">
                            Edit
                          </button>
                          <button
                            onClick={() => handleStatusChange(store, store.status === 'active' ? 'inactive' : 'active')}
                            className={store.status === 'active' ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}
                          >
                            {store.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="admins">
          <StoreAdminsDashboard />
        </TabsContent>
      </Tabs>

      {/* View Store Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Store Details"
      >
        {selectedStore && <StoreDetails store={selectedStore} />}
      </Modal>

      {/* Create Store Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Store"
      >
        <CreateStoreForm 
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            refetch();
            setIsCreateModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
};
