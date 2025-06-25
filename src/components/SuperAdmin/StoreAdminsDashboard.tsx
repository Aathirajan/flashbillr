import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

import { Button } from '../Common/Button';
import { Alert } from '../Common/Alert';
import { DataTable } from '../Common/DataTable';
import { Modal } from '../Common/Modal';
import { CreateStoreAdminForm } from './CreateStoreAdminForm';
import { EditStoreAdminForm } from './EditStoreAdminForm';
import { storeAdminService } from '../../services/storeAdmin.service';

import type { StoreAdmin } from '../../types/store-admin.types';

export const StoreAdminsDashboard: React.FC = () => {
  const { user } = useAuth();
  const [storeAdmins, setStoreAdmins] = useState<StoreAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<StoreAdmin | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch store admins
  const fetchStoreAdmins = async () => {
    try {
      setIsLoading(true);
      const response = await storeAdminService.getStoreAdmins();
      setStoreAdmins(response.data);
    } catch (error) {
      console.error('Error fetching store admins:', error);
      setError('Failed to load store admins. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'superadmin') {
      fetchStoreAdmins();
    }
  }, [user]);

  const refreshList = () => fetchStoreAdmins();

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    setSuccess('Store admin created successfully!');
    fetchStoreAdmins();
    
    // Clear success message after 5 seconds
    setTimeout(() => setSuccess(''), 5000);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setSuccess('Store admin updated successfully!');
    fetchStoreAdmins();
    
    // Clear success message after 5 seconds
    setTimeout(() => setSuccess(''), 5000);
  };

  if (user?.role !== 'superadmin') {
    return (
      <div className="p-6">
        <Alert variant="error">You don't have permission to view this page.</Alert>
      </div>
    );
  }

  // Render the component
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Store Admins</h2>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2"
        >
          <span>+</span>
          Add Admin
        </Button>
      </div>

      {error && (
        <Alert variant="error">{error}</Alert>
      )}

      {success && (
        <Alert variant="success">{success}</Alert>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {isLoading ? (
          <div className="p-6 text-center">Loading store admins...</div>
        ) : (
          <DataTable
            headers={["Name / Store", "Email", "Role", "Status", "Actions"]}
          >
            {storeAdmins.map((admin) => (
              <tr key={admin.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {admin.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {admin.storeId}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {admin.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {admin.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {admin.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                    onClick={() => {
                      setSelectedAdmin(admin);
                      setShowEditModal(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-900"
                    onClick={async () => {
                      if (confirm('Delete this admin?')) {
                        try {
                          await storeAdminService.deleteStoreAdmin(admin.id);
                          refreshList();
                          setSuccess('Store admin deleted successfully!');
                          setTimeout(() => setSuccess(''), 5000);
                        } catch (err) {
                          setError((err as Error).message);
                        }
                      }
                    }}
                  >
                    Delete
                  </Button>
                </td>
                  </tr>
                ))}
            </DataTable>
          )}
        </div>

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add New Store Admin"
      >
        <div className="p-4">
          <h3 className="text-lg font-medium mb-4">Create New Store Admin</h3>
          <CreateStoreAdminForm
            onSuccess={handleCreateSuccess}
            onError={(err) => setError(err.message)}
          />
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal && !!selectedAdmin}
        onClose={() => setShowEditModal(false)}
        title="Edit Store Admin"
      >
        {selectedAdmin && (
          <EditStoreAdminForm
            admin={selectedAdmin}
            onSuccess={handleEditSuccess}
            onError={(err) => setError(err.message)}
          />
        )}
      </Modal>
    </div>
  );
};