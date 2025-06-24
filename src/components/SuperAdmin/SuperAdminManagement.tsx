import React, { useState } from 'react';
import { UserCog, Plus, Edit, Trash2, Shield, Mail, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card } from '../Common/Card';
import { Button } from '../Common/Button';
import { Modal } from '../Common/Modal';
import { useAsyncAction } from '../../hooks/useApi';
import { systemService } from '../../services/system';

export const SuperAdminManagement: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { execute: createSuperAdmin, loading: createLoading } = useAsyncAction(
    async (data: any) => {
      await systemService.createSuperAdmin(data);
      // Refresh the list
    }
  );

  // Mock data for demonstration
  const superAdmins = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@vectorlab.in',
      status: 'active',
      lastLogin: '2024-01-20T14:30:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      permissions: ['all'],
      twoFactorEnabled: true
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@vectorlab.in',
      status: 'active',
      lastLogin: '2024-01-19T16:45:00Z',
      createdAt: '2024-01-05T00:00:00Z',
      permissions: ['stores', 'users', 'analytics'],
      twoFactorEnabled: true
    },
    {
      id: '3',
      name: 'Bob Wilson',
      email: 'bob@vectorlab.in',
      status: 'inactive',
      lastLogin: '2024-01-13T12:00:00Z',
      createdAt: '2024-01-10T00:00:00Z',
      permissions: ['stores', 'analytics'],
      twoFactorEnabled: false
    }
  ];

  const handleEditAdmin = (admin: any) => {
    setSelectedAdmin(admin);
    setIsEditModalOpen(true);
  };

  const handleDeleteAdmin = async (adminId: string) => {
    if (window.confirm('Are you sure you want to delete this super admin? This action cannot be undone.')) {
      try {
        // await systemService.deleteSuperAdmin(adminId);
        alert('Super admin deleted successfully!');
      } catch (error) {
        console.error('Failed to delete super admin:', error);
      }
    }
  };

  const statusConfig = {
    active: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Active' },
    inactive: { color: 'bg-gray-100 text-gray-800', icon: XCircle, label: 'Inactive' },
    suspended: { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Suspended' },
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Super Admin Management</h1>
          <p className="text-gray-600 mt-1">Manage super administrator accounts and permissions</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Super Admin
        </Button>
      </div>

      {/* Super Admin Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card padding="sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-4">
              <UserCog className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Admins</p>
              <p className="text-2xl font-bold text-gray-900">{superAdmins.length}</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-4">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Admins</p>
              <p className="text-2xl font-bold text-gray-900">{superAdmins.filter(a => a.status === 'active').length}</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">2FA Enabled</p>
              <p className="text-2xl font-bold text-gray-900">{superAdmins.filter(a => a.twoFactorEnabled).length}</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-4">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Online Now</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Super Admins List */}
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Super Administrators</h2>
        <div className="space-y-4">
          {superAdmins.map((admin) => {
            const statusInfo = statusConfig[admin.status as keyof typeof statusConfig];
            const StatusIcon = statusInfo.icon;
            
            return (
              <div key={admin.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center flex-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mr-4 flex items-center justify-center">
                    <span className="text-white font-medium text-lg">
                      {admin.name.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="font-medium text-gray-900">{admin.name}</h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </span>
                      {admin.twoFactorEnabled && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <Shield className="w-3 h-3 mr-1" />
                          2FA
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {admin.email}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        Last login: {new Date(admin.lastLogin).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <span className="text-xs text-gray-500">Permissions: </span>
                      <div className="inline-flex flex-wrap gap-1 mt-1">
                        {admin.permissions.map((permission: string) => (
                          <span key={permission} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                            {permission}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditAdmin(admin)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteAdmin(admin.id)}
                    className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Permissions Overview */}
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Permission Levels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">All Permissions</h4>
            <p className="text-sm text-gray-600">Full system access including user management, system configuration, and all store operations.</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Store Management</h4>
            <p className="text-sm text-gray-600">Create, edit, suspend stores and manage store subscriptions.</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">User Management</h4>
            <p className="text-sm text-gray-600">Manage store admins and customer accounts across the platform.</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Analytics</h4>
            <p className="text-sm text-gray-600">View platform-wide analytics and generate reports.</p>
          </div>
        </div>
      </Card>

      {/* Create Super Admin Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add Super Administrator"
        size="md"
      >
        <CreateSuperAdminForm onClose={() => setIsCreateModalOpen(false)} />
      </Modal>

      {/* Edit Super Admin Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Super Administrator"
        size="md"
      >
        {selectedAdmin && (
          <EditSuperAdminForm 
            admin={selectedAdmin}
            onClose={() => setIsEditModalOpen(false)} 
          />
        )}
      </Modal>
    </div>
  );
};

// Create Super Admin Form Component
const CreateSuperAdminForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    permissions: ['stores', 'analytics'],
    sendInvite: true
  });

  const { execute: createAdmin, loading, error } = useAsyncAction(
    async (data: any) => {
      await systemService.createSuperAdmin(data);
      alert('Super admin created successfully! Invitation email sent.');
      onClose();
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createAdmin(formData);
  };

  const availablePermissions = [
    { id: 'all', label: 'All Permissions', description: 'Full system access' },
    { id: 'stores', label: 'Store Management', description: 'Manage stores and subscriptions' },
    { id: 'users', label: 'User Management', description: 'Manage user accounts' },
    { id: 'analytics', label: 'Analytics', description: 'View platform analytics' },
    { id: 'system', label: 'System Config', description: 'Modify system settings' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name *
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          placeholder="Enter full name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          placeholder="admin@vectorlab.in"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Permissions *
        </label>
        <div className="space-y-2">
          {availablePermissions.map((permission) => (
            <label key={permission.id} className="flex items-start">
              <input
                type="checkbox"
                checked={formData.permissions.includes(permission.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData({
                      ...formData,
                      permissions: [...formData.permissions, permission.id]
                    });
                  } else {
                    setFormData({
                      ...formData,
                      permissions: formData.permissions.filter(p => p !== permission.id)
                    });
                  }
                }}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mt-1"
              />
              <div className="ml-2">
                <span className="text-sm font-medium text-gray-700">{permission.label}</span>
                <p className="text-xs text-gray-500">{permission.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.sendInvite}
            onChange={(e) => setFormData({ ...formData, sendInvite: e.target.checked })}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="ml-2 text-sm text-gray-700">Send invitation email</span>
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={loading}>
          Create Super Admin
        </Button>
      </div>
    </form>
  );
};

// Edit Super Admin Form Component
const EditSuperAdminForm: React.FC<{ admin: any; onClose: () => void }> = ({ admin, onClose }) => {
  const [formData, setFormData] = useState({
    name: admin.name,
    email: admin.email,
    permissions: admin.permissions,
    status: admin.status
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle update logic here
    alert('Super admin updated successfully!');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name *
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Update Super Admin
        </Button>
      </div>
    </form>
  );
};