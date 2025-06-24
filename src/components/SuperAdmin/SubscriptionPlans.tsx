import React, { useState } from 'react';
import { Plus, Edit, Trash2, Crown, Check, X, DollarSign, Users, Package, Zap } from 'lucide-react';
import { Card } from '../Common/Card';
import { Button } from '../Common/Button';
import { Modal } from '../Common/Modal';
import { useApi, useAsyncAction } from '../../hooks/useApi';
import { subscriptionService } from '../../services/subscriptions';
import { SubscriptionPlan } from '../../types';
import { clsx } from 'clsx';

export const SubscriptionPlans: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: plansData, loading, error, refetch } = useApi(
    () => subscriptionService.getAllSubscriptionPlans(),
    []
  );

  const { execute: deletePlan, loading: deleteLoading } = useAsyncAction(
    async (planId: string) => {
      // await subscriptionService.deleteSubscriptionPlan(planId);
      refetch();
    }
  );

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setIsEditModalOpen(true);
  };

  const handleDeletePlan = async (planId: string) => {
    if (window.confirm('Are you sure you want to delete this plan? This action cannot be undone.')) {
      try {
        await deletePlan(planId);
      } catch (error) {
        console.error('Failed to delete plan:', error);
      }
    }
  };

  // Mock data for demonstration
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      description: 'Perfect for small businesses getting started',
      price: 29,
      billingCycle: 'MONTHLY' as const,
      features: {
        products: 100,
        storage: '1GB',
        bandwidth: '10GB',
        support: 'Email',
        analytics: 'Basic',
        customDomain: false,
        apiAccess: false,
        multiLocation: false,
      }
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Ideal for growing businesses with advanced needs',
      price: 79,
      billingCycle: 'MONTHLY' as const,
      features: {
        products: 1000,
        storage: '10GB',
        bandwidth: '100GB',
        support: 'Priority',
        analytics: 'Advanced',
        customDomain: true,
        apiAccess: true,
        multiLocation: false,
      }
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large businesses requiring maximum flexibility',
      price: 199,
      billingCycle: 'MONTHLY' as const,
      features: {
        products: 'Unlimited',
        storage: '100GB',
        bandwidth: 'Unlimited',
        support: '24/7 Phone',
        analytics: 'Custom',
        customDomain: true,
        apiAccess: true,
        multiLocation: true,
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subscription Plans</h1>
          <p className="text-gray-600 mt-1">Manage pricing plans and features for stores</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Plan
        </Button>
      </div>

      {/* Plan Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card padding="sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-4">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Plans</p>
              <p className="text-2xl font-bold text-gray-900">{plans.length}</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-4">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$89.2K</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">12.5%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <Card key={plan.id} className={clsx(
            'relative',
            index === 1 && 'border-2 border-primary-500 shadow-lg'
          )}>
            {index === 1 && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Most Popular
                </span>
              </div>
            )}
            
            <div className="text-center mb-6">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                index === 0 ? 'bg-gradient-to-r from-gray-500 to-gray-600' :
                index === 1 ? 'bg-gradient-to-r from-primary-500 to-primary-600' :
                'bg-gradient-to-r from-purple-500 to-purple-600'
              }`}>
                {index === 2 ? <Crown className="w-8 h-8 text-white" /> : <Package className="w-8 h-8 text-white" />}
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
              <p className="text-gray-600 mt-2">{plan.description}</p>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                <span className="text-gray-600">/month</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Products</span>
                <span className="font-medium text-gray-900">{plan.features.products}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Storage</span>
                <span className="font-medium text-gray-900">{plan.features.storage}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Bandwidth</span>
                <span className="font-medium text-gray-900">{plan.features.bandwidth}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Support</span>
                <span className="font-medium text-gray-900">{plan.features.support}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Analytics</span>
                <span className="font-medium text-gray-900">{plan.features.analytics}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Custom Domain</span>
                {plan.features.customDomain ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <X className="w-5 h-5 text-red-500" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">API Access</span>
                {plan.features.apiAccess ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <X className="w-5 h-5 text-red-500" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Multi-location</span>
                {plan.features.multiLocation ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <X className="w-5 h-5 text-red-500" />
                )}
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => handleEditPlan(plan as any)}
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeletePlan(plan.id)}
                disabled={deleteLoading}
                className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-center text-sm text-gray-600">
                <span className="font-medium">
                  {index === 0 ? '89' : index === 1 ? '567' : '234'}
                </span> active subscriptions
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Plan Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Subscription Plan"
        size="lg"
      >
        <PlanForm onClose={() => setIsCreateModalOpen(false)} onSuccess={refetch} />
      </Modal>

      {/* Edit Plan Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Subscription Plan"
        size="lg"
      >
        {selectedPlan && (
          <PlanForm 
            plan={selectedPlan}
            onClose={() => setIsEditModalOpen(false)} 
            onSuccess={refetch} 
          />
        )}
      </Modal>
    </div>
  );
};

// Plan Form Component
const PlanForm: React.FC<{ 
  plan?: SubscriptionPlan;
  onClose: () => void; 
  onSuccess: () => void;
}> = ({ plan, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: plan?.name || '',
    description: plan?.description || '',
    price: plan?.price || 0,
    billingCycle: plan?.billingCycle || 'MONTHLY',
    features: {
      products: plan?.features?.products || '',
      storage: plan?.features?.storage || '',
      bandwidth: plan?.features?.bandwidth || '',
      support: plan?.features?.support || '',
      analytics: plan?.features?.analytics || '',
      customDomain: plan?.features?.customDomain || false,
      apiAccess: plan?.features?.apiAccess || false,
      multiLocation: plan?.features?.multiLocation || false,
    }
  });

  const { execute: savePlan, loading, error } = useAsyncAction(
    async (data: any) => {
      if (plan) {
        await subscriptionService.updateSubscriptionPlan(plan.id, data);
      } else {
        await subscriptionService.createSubscriptionPlan(data);
      }
      onSuccess();
      onClose();
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await savePlan(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Plan Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            placeholder="Basic, Pro, Enterprise..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price *
          </label>
          <input
            type="number"
            required
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            placeholder="29.99"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          required
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          rows={3}
          placeholder="Plan description..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Billing Cycle *
        </label>
        <select
          required
          value={formData.billingCycle}
          onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value as any })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        >
          <option value="MONTHLY">Monthly</option>
          <option value="YEARLY">Yearly</option>
        </select>
      </div>

      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Features</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Products Limit
            </label>
            <input
              type="text"
              value={formData.features.products}
              onChange={(e) => setFormData({ 
                ...formData, 
                features: { ...formData.features, products: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="100, 1000, Unlimited"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Storage
            </label>
            <input
              type="text"
              value={formData.features.storage}
              onChange={(e) => setFormData({ 
                ...formData, 
                features: { ...formData.features, storage: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="1GB, 10GB, 100GB"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bandwidth
            </label>
            <input
              type="text"
              value={formData.features.bandwidth}
              onChange={(e) => setFormData({ 
                ...formData, 
                features: { ...formData.features, bandwidth: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="10GB, 100GB, Unlimited"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Support Level
            </label>
            <select
              value={formData.features.support}
              onChange={(e) => setFormData({ 
                ...formData, 
                features: { ...formData.features, support: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="Email">Email</option>
              <option value="Priority">Priority</option>
              <option value="24/7 Phone">24/7 Phone</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Analytics
            </label>
            <select
              value={formData.features.analytics}
              onChange={(e) => setFormData({ 
                ...formData, 
                features: { ...formData.features, analytics: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="Basic">Basic</option>
              <option value="Advanced">Advanced</option>
              <option value="Custom">Custom</option>
            </select>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.features.customDomain}
              onChange={(e) => setFormData({ 
                ...formData, 
                features: { ...formData.features, customDomain: e.target.checked }
              })}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Custom Domain</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.features.apiAccess}
              onChange={(e) => setFormData({ 
                ...formData, 
                features: { ...formData.features, apiAccess: e.target.checked }
              })}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">API Access</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.features.multiLocation}
              onChange={(e) => setFormData({ 
                ...formData, 
                features: { ...formData.features, multiLocation: e.target.checked }
              })}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Multi-location Support</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={loading}>
          {plan ? 'Update Plan' : 'Create Plan'}
        </Button>
      </div>
    </form>
  );
};