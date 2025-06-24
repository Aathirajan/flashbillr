import React, { useState } from 'react';
import { Key, Plus, Copy, Trash2, Eye, EyeOff, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { Card } from '../Common/Card';
import { Button } from '../Common/Button';
import { Modal } from '../Common/Modal';
import { useApi, useAsyncAction } from '../../hooks/useApi';
import { apiKeyService } from '../../services/apiKeys';

export const ApiKeyManagement: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<any>(null);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const { data: apiKeysData, loading, error, refetch } = useApi(
    () => apiKeyService.getApiKeys(),
    []
  );

  const { execute: revokeKey, loading: revokeLoading } = useAsyncAction(
    async (keyId: string) => {
      await apiKeyService.revokeApiKey(keyId);
      refetch();
    }
  );

  const handleRevokeKey = async (keyId: string) => {
    if (window.confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      try {
        await revokeKey(keyId);
      } catch (error) {
        console.error('Failed to revoke API key:', error);
      }
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('API key copied to clipboard!');
  };

  // Mock data for demonstration
  const apiKeys = [
    {
      id: '1',
      name: 'Master API Key',
      key: 'vl_live_sk_1234567890abcdef1234567890abcdef',
      active: true,
      createdAt: '2024-01-15T10:00:00Z',
      lastUsed: '2024-01-20T14:30:00Z',
      storeId: null
    },
    {
      id: '2',
      name: 'Analytics API Key',
      key: 'vl_live_sk_abcdef1234567890abcdef1234567890',
      active: true,
      createdAt: '2024-01-10T09:00:00Z',
      lastUsed: '2024-01-19T16:45:00Z',
      storeId: null
    },
    {
      id: '3',
      name: 'Webhook API Key',
      key: 'vl_live_sk_fedcba0987654321fedcba0987654321',
      active: false,
      createdAt: '2024-01-05T11:00:00Z',
      lastUsed: '2024-01-15T12:00:00Z',
      storeId: null
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">API Key Management</h1>
          <p className="text-gray-600 mt-1">Manage API keys for platform integrations and store access</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Generate API Key
        </Button>
      </div>

      {/* API Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card padding="sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-4">
              <Key className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Keys</p>
              <p className="text-2xl font-bold text-gray-900">{apiKeys.length}</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-4">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Keys</p>
              <p className="text-2xl font-bold text-gray-900">{apiKeys.filter(k => k.active).length}</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-4">
              <RefreshCw className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">API Calls Today</p>
              <p className="text-2xl font-bold text-gray-900">12.5K</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-4">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Rate Limited</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </Card>
      </div>

      {/* API Keys List */}
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Platform API Keys</h2>
        <div className="space-y-4">
          {apiKeys.map((apiKey) => (
            <div key={apiKey.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg mr-3 flex items-center justify-center">
                    <Key className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{apiKey.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <span>Created: {new Date(apiKey.createdAt).toLocaleDateString()}</span>
                      {apiKey.lastUsed && (
                        <span>Last used: {new Date(apiKey.lastUsed).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 flex items-center space-x-2">
                  <div className="flex-1 bg-gray-100 rounded-lg p-2 font-mono text-sm">
                    {showKeys[apiKey.id] ? apiKey.key : '•'.repeat(48)}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleKeyVisibility(apiKey.id)}
                  >
                    {showKeys[apiKey.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(apiKey.key)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 ml-4">
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                  apiKey.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {apiKey.active ? 'Active' : 'Revoked'}
                </span>
                {apiKey.active && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRevokeKey(apiKey.id)}
                    disabled={revokeLoading}
                    className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* API Usage Guidelines */}
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-4">API Usage Guidelines</h2>
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Rate Limits</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Master API Key: 10,000 requests per hour</li>
              <li>• Analytics API Key: 5,000 requests per hour</li>
              <li>• Store API Keys: 1,000 requests per hour</li>
            </ul>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-amber-900 mb-2">Security Best Practices</h4>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• Never expose API keys in client-side code</li>
              <li>• Rotate API keys regularly</li>
              <li>• Use environment variables to store keys</li>
              <li>• Monitor API key usage for suspicious activity</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Create API Key Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Generate New API Key"
        size="md"
      >
        <CreateApiKeyForm onClose={() => setIsCreateModalOpen(false)} onSuccess={refetch} />
      </Modal>
    </div>
  );
};

// Create API Key Form Component
const CreateApiKeyForm: React.FC<{ onClose: () => void; onSuccess: () => void }> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: {
      read: true,
      write: false,
      delete: false,
      admin: false
    }
  });

  const { execute: createKey, loading, error } = useAsyncAction(
    async (data: any) => {
      await apiKeyService.createApiKey(data);
      onSuccess();
      onClose();
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createKey(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          API Key Name *
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          placeholder="e.g., Analytics Dashboard Key"
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
          placeholder="Describe what this API key will be used for..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Permissions
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.permissions.read}
              onChange={(e) => setFormData({
                ...formData,
                permissions: { ...formData.permissions, read: e.target.checked }
              })}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Read access</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.permissions.write}
              onChange={(e) => setFormData({
                ...formData,
                permissions: { ...formData.permissions, write: e.target.checked }
              })}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Write access</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.permissions.delete}
              onChange={(e) => setFormData({
                ...formData,
                permissions: { ...formData.permissions, delete: e.target.checked }
              })}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Delete access</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.permissions.admin}
              onChange={(e) => setFormData({
                ...formData,
                permissions: { ...formData.permissions, admin: e.target.checked }
              })}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Admin access</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={loading}>
          Generate API Key
        </Button>
      </div>
    </form>
  );
};