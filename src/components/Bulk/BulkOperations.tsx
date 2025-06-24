import React, { useState } from 'react';
import { Upload, Download, FileText, Users, Package, ShoppingCart, AlertCircle, CheckCircle, X, RefreshCw } from 'lucide-react';
import { Card } from '../Common/Card';
import { Button } from '../Common/Button';
import { Modal } from '../Common/Modal';
import { useAsyncAction } from '../../hooks/useApi';
import { productService } from '../../services/products';
import { customerService } from '../../services/customers';
import { orderService } from '../../services/orders';
import { clsx } from 'clsx';

interface BulkOperationResult {
  success: number;
  failed: number;
  errors: string[];
}

export const BulkOperations: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'customers' | 'orders'>('products');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [importResults, setImportResults] = useState<BulkOperationResult | null>(null);

  const tabs = [
    { id: 'products' as const, label: 'Products', icon: Package },
    { id: 'customers' as const, label: 'Customers', icon: Users },
    { id: 'orders' as const, label: 'Orders', icon: ShoppingCart },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Bulk Operations</h2>
        <p className="text-gray-600 mt-1">Import, export, and manage your data in bulk</p>
      </div>

      {/* Tab Navigation */}
      <Card>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    'flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'products' && <ProductBulkOperations />}
          {activeTab === 'customers' && <CustomerBulkOperations />}
          {activeTab === 'orders' && <OrderBulkOperations />}
        </div>
      </Card>

      {/* Import Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title={`Import ${activeTab}`}
        size="lg"
      >
        <ImportForm 
          type={activeTab}
          onClose={() => setIsImportModalOpen(false)}
          onSuccess={(results) => {
            setImportResults(results);
            setIsImportModalOpen(false);
          }}
        />
      </Modal>

      {/* Export Modal */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title={`Export ${activeTab}`}
        size="md"
      >
        <ExportForm 
          type={activeTab}
          onClose={() => setIsExportModalOpen(false)}
        />
      </Modal>

      {/* Results Modal */}
      {importResults && (
        <Modal
          isOpen={true}
          onClose={() => setImportResults(null)}
          title="Import Results"
          size="md"
        >
          <ImportResults results={importResults} />
        </Modal>
      )}
    </div>
  );
};

// Product Bulk Operations Component
const ProductBulkOperations: React.FC = () => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<'activate' | 'deactivate' | 'delete' | 'update-inventory'>('activate');
  const [inventoryValue, setInventoryValue] = useState('');

  const { execute: bulkUpdateProducts, loading: updateLoading } = useAsyncAction(
    async (action: string, productIds: string[], value?: any) => {
      switch (action) {
        case 'activate':
          return productService.bulkUpdateProducts(
            productIds.map(id => ({ id, data: { isActive: true } }))
          );
        case 'deactivate':
          return productService.bulkUpdateProducts(
            productIds.map(id => ({ id, data: { isActive: false } }))
          );
        case 'delete':
          return productService.bulkDeleteProducts(productIds);
        case 'update-inventory':
          return productService.bulkUpdateInventory(
            productIds.map(id => ({ productId: id, stock: parseInt(value) }))
          );
        default:
          throw new Error('Invalid action');
      }
    }
  );

  const handleBulkAction = async () => {
    if (selectedProducts.length === 0) return;
    
    try {
      await bulkUpdateProducts(bulkAction, selectedProducts, inventoryValue);
      setSelectedProducts([]);
      alert('Bulk operation completed successfully!');
    } catch (error) {
      console.error('Bulk operation failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Import/Export Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card padding="sm" hover>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-4">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Import Products</h3>
                <p className="text-sm text-gray-600">Upload CSV file to add products in bulk</p>
              </div>
            </div>
            <Button size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
          </div>
        </Card>

        <Card padding="sm" hover>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-4">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Export Products</h3>
                <p className="text-sm text-gray-600">Download your products as CSV</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </Card>
      </div>

      {/* Bulk Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk Actions</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Action
            </label>
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="activate">Activate Products</option>
              <option value="deactivate">Deactivate Products</option>
              <option value="update-inventory">Update Inventory</option>
              <option value="delete">Delete Products</option>
            </select>
          </div>

          {bulkAction === 'update-inventory' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Stock Quantity
              </label>
              <input
                type="number"
                value={inventoryValue}
                onChange={(e) => setInventoryValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="Enter stock quantity"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product IDs (comma-separated)
            </label>
            <textarea
              value={selectedProducts.join(', ')}
              onChange={(e) => setSelectedProducts(e.target.value.split(',').map(id => id.trim()).filter(Boolean))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              rows={3}
              placeholder="Enter product IDs separated by commas"
            />
          </div>

          <Button 
            onClick={handleBulkAction}
            isLoading={updateLoading}
            disabled={selectedProducts.length === 0}
            variant={bulkAction === 'delete' ? 'danger' : 'primary'}
          >
            {bulkAction === 'delete' && <AlertCircle className="w-4 h-4 mr-2" />}
            Execute Bulk Action ({selectedProducts.length} products)
          </Button>
        </div>
      </Card>

      {/* Template Download */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Import Template</h3>
        <p className="text-gray-600 mb-4">
          Download the CSV template to ensure your import file has the correct format.
        </p>
        <Button variant="outline">
          <FileText className="w-4 h-4 mr-2" />
          Download Product Template
        </Button>
      </Card>
    </div>
  );
};

// Customer Bulk Operations Component
const CustomerBulkOperations: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Import/Export Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card padding="sm" hover>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-4">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Import Customers</h3>
                <p className="text-sm text-gray-600">Upload CSV file to add customers in bulk</p>
              </div>
            </div>
            <Button size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
          </div>
        </Card>

        <Card padding="sm" hover>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-4">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Export Customers</h3>
                <p className="text-sm text-gray-600">Download your customers as CSV</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </Card>
      </div>

      {/* Customer Segmentation */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Segmentation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">High Value Customers</span>
              <span className="text-lg font-bold text-green-600">247</span>
            </div>
            <p className="text-xs text-gray-500">Customers with $1000+ total spent</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Regular Customers</span>
              <span className="text-lg font-bold text-blue-600">1,234</span>
            </div>
            <p className="text-xs text-gray-500">Customers with 3+ orders</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">New Customers</span>
              <span className="text-lg font-bold text-purple-600">89</span>
            </div>
            <p className="text-xs text-gray-500">Customers from last 30 days</p>
          </div>
        </div>
      </Card>

      {/* Template Download */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Import Template</h3>
        <p className="text-gray-600 mb-4">
          Download the CSV template to ensure your import file has the correct format.
        </p>
        <Button variant="outline">
          <FileText className="w-4 h-4 mr-2" />
          Download Customer Template
        </Button>
      </Card>
    </div>
  );
};

// Order Bulk Operations Component
const OrderBulkOperations: React.FC = () => {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'>('PROCESSING');

  const { execute: bulkUpdateOrderStatus, loading: updateLoading } = useAsyncAction(
    async (orders: Array<{ orderId: string; status: string }>) => {
      return orderService.bulkUpdateOrderStatus(orders);
    }
  );

  const handleBulkStatusUpdate = async () => {
    if (selectedOrders.length === 0) return;
    
    try {
      const orders = selectedOrders.map(orderId => ({ orderId, status: bulkStatus }));
      await bulkUpdateOrderStatus(orders);
      setSelectedOrders([]);
      alert('Bulk status update completed successfully!');
    } catch (error) {
      console.error('Bulk status update failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card padding="sm" hover>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center mr-4">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Export Orders</h3>
                <p className="text-sm text-gray-600">Download orders as CSV for analysis</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </Card>

        <Card padding="sm" hover>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mr-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Generate Reports</h3>
                <p className="text-sm text-gray-600">Create detailed order reports</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Generate
            </Button>
          </div>
        </Card>
      </div>

      {/* Bulk Status Update */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk Status Update</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Status
            </label>
            <select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order IDs (comma-separated)
            </label>
            <textarea
              value={selectedOrders.join(', ')}
              onChange={(e) => setSelectedOrders(e.target.value.split(',').map(id => id.trim()).filter(Boolean))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              rows={3}
              placeholder="Enter order IDs separated by commas"
            />
          </div>

          <Button 
            onClick={handleBulkStatusUpdate}
            isLoading={updateLoading}
            disabled={selectedOrders.length === 0}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Update Status ({selectedOrders.length} orders)
          </Button>
        </div>
      </Card>

      {/* Order Analytics */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Analytics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">45</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">123</div>
            <div className="text-sm text-gray-600">Processing</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">89</div>
            <div className="text-sm text-gray-600">Shipped</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-green-600">567</div>
            <div className="text-sm text-gray-600">Delivered</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Import Form Component
const ImportForm: React.FC<{
  type: 'products' | 'customers' | 'orders';
  onClose: () => void;
  onSuccess: (results: BulkOperationResult) => void;
}> = ({ type, onClose, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const { execute: importData, loading, error } = useAsyncAction(
    async (file: File) => {
      // Mock import logic - in real app, this would parse CSV and call API
      const mockResults: BulkOperationResult = {
        success: Math.floor(Math.random() * 100) + 50,
        failed: Math.floor(Math.random() * 10),
        errors: ['Sample error message', 'Another validation error']
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return mockResults;
    }
  );

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    
    try {
      const results = await importData(file);
      onSuccess(results);
    } catch (error) {
      console.error('Import failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload CSV File
        </label>
        <div
          className={clsx(
            'border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200',
            dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400'
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">
            {file ? file.name : 'Drag and drop your CSV file here, or click to browse'}
          </p>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
          >
            Choose File
          </label>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Import Guidelines:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• File must be in CSV format</li>
          <li>• Maximum file size: 10MB</li>
          <li>• Use the provided template for correct formatting</li>
          <li>• Duplicate entries will be skipped</li>
        </ul>
      </div>

      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={loading} disabled={!file}>
          Import {type}
        </Button>
      </div>
    </form>
  );
};

// Export Form Component
const ExportForm: React.FC<{
  type: 'products' | 'customers' | 'orders';
  onClose: () => void;
}> = ({ type, onClose }) => {
  const [exportOptions, setExportOptions] = useState({
    format: 'csv',
    dateRange: 'all',
    includeInactive: false,
  });

  const { execute: exportData, loading } = useAsyncAction(
    async (options: any) => {
      // Mock export logic
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real app, this would trigger a download
      const blob = new Blob(['mock,csv,data\n1,2,3'], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-export.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      onClose();
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await exportData(exportOptions);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Export Format
        </label>
        <select
          value={exportOptions.format}
          onChange={(e) => setExportOptions({ ...exportOptions, format: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        >
          <option value="csv">CSV</option>
          <option value="xlsx">Excel (XLSX)</option>
          <option value="json">JSON</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date Range
        </label>
        <select
          value={exportOptions.dateRange}
          onChange={(e) => setExportOptions({ ...exportOptions, dateRange: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        >
          <option value="all">All Time</option>
          <option value="last30">Last 30 Days</option>
          <option value="last90">Last 90 Days</option>
          <option value="thisYear">This Year</option>
        </select>
      </div>

      {type === 'products' && (
        <div className="flex items-center">
          <input
            type="checkbox"
            id="includeInactive"
            checked={exportOptions.includeInactive}
            onChange={(e) => setExportOptions({ ...exportOptions, includeInactive: e.target.checked })}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="includeInactive" className="ml-2 text-sm text-gray-700">
            Include inactive products
          </label>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={loading}>
          <Download className="w-4 h-4 mr-2" />
          Export {type}
        </Button>
      </div>
    </form>
  );
};

// Import Results Component
const ImportResults: React.FC<{ results: BulkOperationResult }> = ({ results }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">Import Completed</h3>
        <p className="text-gray-600 mt-1">Your data has been processed</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{results.success}</div>
          <div className="text-sm text-green-700">Successful</div>
        </div>
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{results.failed}</div>
          <div className="text-sm text-red-700">Failed</div>
        </div>
      </div>

      {results.errors.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Errors:</h4>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <ul className="text-sm text-red-700 space-y-1">
              {results.errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};