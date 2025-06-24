import React, { useState } from 'react';
import { FileText, Download, Calendar, Package, Users, ShoppingCart, Eye, Printer, Mail, Share2, Filter, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '../Common/Card';
import { Button } from '../Common/Button';
import { Modal } from '../Common/Modal';
import { useApi, useAsyncAction } from '../../hooks/useApi';
import { orderService } from '../../services/orders';
import { clsx } from 'clsx';

interface PDFReportsProps {}

export const PDFReports: React.FC<PDFReportsProps> = () => {
  const [activeTab, setActiveTab] = useState<'invoices' | 'reports' | 'labels' | 'bulk'>('invoices');
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<string>('');
  const [generationResults, setGenerationResults] = useState<any>(null);

  const tabs = [
    { id: 'invoices' as const, label: 'Invoices', icon: FileText },
    { id: 'reports' as const, label: 'Reports', icon: Package },
    { id: 'labels' as const, label: 'Shipping Labels', icon: Package },
    { id: 'bulk' as const, label: 'Bulk Generation', icon: Download },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">PDF Reports</h2>
        <p className="text-gray-600 mt-1">Generate and manage PDF documents for your store</p>
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
          {activeTab === 'invoices' && <InvoiceGeneration />}
          {activeTab === 'reports' && <ReportGeneration />}
          {activeTab === 'labels' && <ShippingLabels />}
          {activeTab === 'bulk' && <BulkGeneration />}
        </div>
      </Card>

      {/* Generate Modal */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title={`Generate ${selectedReportType}`}
        size="lg"
      >
        <PDFGenerationForm 
          type={selectedReportType}
          onClose={() => setIsGenerateModalOpen(false)}
          onSuccess={(results) => {
            setGenerationResults(results);
            setIsGenerateModalOpen(false);
          }}
        />
      </Modal>

      {/* Results Modal */}
      {generationResults && (
        <Modal
          isOpen={true}
          onClose={() => setGenerationResults(null)}
          title="PDF Generation Complete"
          size="md"
        >
          <GenerationResults results={generationResults} />
        </Modal>
      )}
    </div>
  );
};

// Invoice Generation Component
const InvoiceGeneration: React.FC = () => {
  const [orderFilters, setOrderFilters] = useState({
    startDate: '',
    endDate: '',
    status: '',
    customerId: '',
  });

  const { execute: generateInvoice, loading } = useAsyncAction(
    async (orderId: string) => {
      return orderService.generateInvoicePDF(orderId);
    }
  );

  const handleGenerateInvoice = async (orderId: string) => {
    try {
      const result = await generateInvoice(orderId);
      // Open PDF in new tab
      window.open(result.url, '_blank');
    } catch (error) {
      console.error('Failed to generate invoice:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card padding="sm" hover className="cursor-pointer">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-4">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Single Invoice</h3>
              <p className="text-sm text-gray-600">Generate invoice for specific order</p>
            </div>
          </div>
        </Card>

        <Card padding="sm" hover className="cursor-pointer">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-4">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Batch Invoices</h3>
              <p className="text-sm text-gray-600">Generate multiple invoices at once</p>
            </div>
          </div>
        </Card>

        <Card padding="sm" hover className="cursor-pointer">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-4">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Monthly Invoices</h3>
              <p className="text-sm text-gray-600">Generate all invoices for a month</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Invoice Filters */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Invoices by Criteria</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={orderFilters.startDate}
              onChange={(e) => setOrderFilters({ ...orderFilters, startDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={orderFilters.endDate}
              onChange={(e) => setOrderFilters({ ...orderFilters, endDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Status
            </label>
            <select
              value={orderFilters.status}
              onChange={(e) => setOrderFilters({ ...orderFilters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="">All Status</option>
              <option value="DELIVERED">Delivered</option>
              <option value="SHIPPED">Shipped</option>
              <option value="PROCESSING">Processing</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer ID
            </label>
            <input
              type="text"
              value={orderFilters.customerId}
              onChange={(e) => setOrderFilters({ ...orderFilters, customerId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="Optional customer ID"
            />
          </div>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Generate Filtered Invoices
        </Button>
      </Card>

      {/* Recent Orders for Invoice Generation */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
        <div className="space-y-3">
          {[
            { id: 'ORD-001', customer: 'John Doe', amount: 299.99, date: '2024-01-15', status: 'DELIVERED' },
            { id: 'ORD-002', customer: 'Jane Smith', amount: 149.50, date: '2024-01-14', status: 'SHIPPED' },
            { id: 'ORD-003', customer: 'Bob Johnson', amount: 89.99, date: '2024-01-13', status: 'PROCESSING' },
          ].map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg mr-3 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{order.id}</div>
                  <div className="text-sm text-gray-600">{order.customer} • ${order.amount}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                  order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status}
                </span>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleGenerateInvoice(order.id)}
                  isLoading={loading}
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Invoice
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// Report Generation Component
const ReportGeneration: React.FC = () => {
  const reportTypes = [
    {
      id: 'sales',
      title: 'Sales Report',
      description: 'Comprehensive sales analysis with charts and metrics',
      icon: ShoppingCart,
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 'inventory',
      title: 'Inventory Report',
      description: 'Stock levels, low inventory alerts, and product performance',
      icon: Package,
      color: 'from-blue-500 to-indigo-500',
    },
    {
      id: 'customers',
      title: 'Customer Report',
      description: 'Customer analytics, segments, and purchase behavior',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'financial',
      title: 'Financial Report',
      description: 'Revenue, expenses, profit margins, and financial metrics',
      icon: FileText,
      color: 'from-orange-500 to-red-500',
    },
  ];

  const { execute: generateReport, loading } = useAsyncAction(
    async (reportType: string, options: any) => {
      // Mock report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { url: `https://example.com/reports/${reportType}.pdf`, reportType };
    }
  );

  const handleGenerateReport = async (reportType: string) => {
    try {
      const result = await generateReport(reportType, {});
      window.open(result.url, '_blank');
    } catch (error) {
      console.error('Failed to generate report:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <Card key={report.id} padding="sm" hover>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-12 h-12 bg-gradient-to-r ${report.color} rounded-lg flex items-center justify-center mr-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                    <p className="text-sm text-gray-600">{report.description}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleGenerateReport(report.id)}
                    isLoading={loading}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleGenerateReport(report.id)}
                    isLoading={loading}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Generate
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Custom Report Builder */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Report Builder</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none">
              <option>Sales Analysis</option>
              <option>Product Performance</option>
              <option>Customer Insights</option>
              <option>Financial Summary</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
              <option>Last year</option>
              <option>Custom range</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Format
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none">
              <option>PDF</option>
              <option>Excel</option>
              <option>CSV</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Include Sections
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Summary', 'Charts', 'Detailed Data', 'Trends', 'Comparisons', 'Forecasts'].map((section) => (
                <label key={section} className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{section}</span>
                </label>
              ))}
            </div>
          </div>
          
          <Button>
            <FileText className="w-4 h-4 mr-2" />
            Generate Custom Report
          </Button>
        </div>
      </Card>

      {/* Scheduled Reports */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Scheduled Reports</h3>
        <div className="space-y-3">
          {[
            { name: 'Weekly Sales Summary', frequency: 'Every Monday', nextRun: '2024-01-22', active: true },
            { name: 'Monthly Inventory Report', frequency: 'First of month', nextRun: '2024-02-01', active: true },
            { name: 'Customer Analytics', frequency: 'Every 15th', nextRun: '2024-01-15', active: false },
          ].map((schedule, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${schedule.active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <div>
                  <div className="font-medium text-gray-900">{schedule.name}</div>
                  <div className="text-sm text-gray-600">{schedule.frequency} • Next: {schedule.nextRun}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline">
                  Edit
                </Button>
                <Button size="sm" variant={schedule.active ? 'outline' : 'primary'}>
                  {schedule.active ? 'Pause' : 'Activate'}
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Add Scheduled Report
          </Button>
        </div>
      </Card>
    </div>
  );
};

// Shipping Labels Component
const ShippingLabels: React.FC = () => {
  const { execute: generateLabel, loading } = useAsyncAction(
    async (orderId: string) => {
      return orderService.generateShippingLabelPDF(orderId);
    }
  );

  const handleGenerateLabel = async (orderId: string) => {
    try {
      const result = await generateLabel(orderId);
      window.open(result.url, '_blank');
    } catch (error) {
      console.error('Failed to generate shipping label:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Label Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card padding="sm" hover>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-4">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Standard Labels</h3>
              <p className="text-sm text-gray-600">4x6 shipping labels for packages</p>
            </div>
          </div>
        </Card>

        <Card padding="sm" hover>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-4">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Return Labels</h3>
              <p className="text-sm text-gray-600">Pre-paid return shipping labels</p>
            </div>
          </div>
        </Card>

        <Card padding="sm" hover>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-4">
              <Printer className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Bulk Labels</h3>
              <p className="text-sm text-gray-600">Multiple labels on one sheet</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Orders Ready for Shipping */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders Ready for Shipping</h3>
        <div className="space-y-3">
          {[
            { id: 'ORD-001', customer: 'John Doe', address: '123 Main St, New York, NY 10001', weight: '2.5 lbs' },
            { id: 'ORD-002', customer: 'Jane Smith', address: '456 Oak Ave, Los Angeles, CA 90210', weight: '1.8 lbs' },
            { id: 'ORD-003', customer: 'Bob Johnson', address: '789 Pine Rd, Chicago, IL 60601', weight: '3.2 lbs' },
          ].map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg mr-3 flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{order.id} - {order.customer}</div>
                  <div className="text-sm text-gray-600">{order.address} • {order.weight}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleGenerateLabel(order.id)}
                  isLoading={loading}
                >
                  <Package className="w-4 h-4 mr-1" />
                  Label
                </Button>
                <Button 
                  size="sm"
                  onClick={() => handleGenerateLabel(order.id)}
                  isLoading={loading}
                >
                  <Printer className="w-4 h-4 mr-1" />
                  Print
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Label Settings */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Label Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Label Size
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none">
              <option>4x6 inches</option>
              <option>4x4 inches</option>
              <option>6x4 inches</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Carrier
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none">
              <option>USPS</option>
              <option>UPS</option>
              <option>FedEx</option>
              <option>DHL</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4 space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              defaultChecked
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Include return address</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              defaultChecked
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Add tracking number</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Include delivery confirmation</span>
          </label>
        </div>
      </Card>
    </div>
  );
};

// Bulk Generation Component
const BulkGeneration: React.FC = () => {
  const [bulkType, setBulkType] = useState<'invoices' | 'labels' | 'reports'>('invoices');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  const { execute: bulkGenerate, loading } = useAsyncAction(
    async (type: string, orderIds: string[]) => {
      // Mock bulk generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      return { 
        generated: orderIds.length, 
        failed: 0, 
        downloadUrl: 'https://example.com/bulk-download.zip' 
      };
    }
  );

  const handleBulkGenerate = async () => {
    if (selectedOrders.length === 0) return;
    
    try {
      const result = await bulkGenerate(bulkType, selectedOrders);
      alert(`Generated ${result.generated} ${bulkType} successfully!`);
      // In real app, would trigger download
    } catch (error) {
      console.error('Bulk generation failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Bulk Generation Options */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk Generation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Type
            </label>
            <select
              value={bulkType}
              onChange={(e) => setBulkType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="invoices">Invoices</option>
              <option value="labels">Shipping Labels</option>
              <option value="reports">Reports</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none">
              <option>Today</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Custom range</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Status
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none">
              <option>All</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Order IDs (comma-separated)
          </label>
          <textarea
            value={selectedOrders.join(', ')}
            onChange={(e) => setSelectedOrders(e.target.value.split(',').map(id => id.trim()).filter(Boolean))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            rows={3}
            placeholder="Enter order IDs or leave empty to use filters above"
          />
        </div>

        <Button 
          onClick={handleBulkGenerate}
          isLoading={loading}
          disabled={selectedOrders.length === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          Generate {selectedOrders.length} {bulkType}
        </Button>
      </Card>

      {/* Generation Queue */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Generation Queue</h3>
        <div className="space-y-3">
          {[
            { id: 1, type: 'Invoices', count: 25, status: 'completed', progress: 100 },
            { id: 2, type: 'Shipping Labels', count: 15, status: 'processing', progress: 60 },
            { id: 3, type: 'Sales Report', count: 1, status: 'pending', progress: 0 },
          ].map((job) => (
            <div key={job.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    job.status === 'completed' ? 'bg-green-500' :
                    job.status === 'processing' ? 'bg-blue-500' :
                    'bg-gray-300'
                  }`}></div>
                  <div>
                    <div className="font-medium text-gray-900">{job.type} ({job.count} items)</div>
                    <div className="text-sm text-gray-600 capitalize">{job.status}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {job.status === 'completed' && (
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  )}
                  {job.status === 'processing' && (
                    <span className="text-sm text-blue-600">{job.progress}%</span>
                  )}
                </div>
              </div>
              {job.status === 'processing' && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${job.progress}%` }}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Bulk Settings */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk Generation Settings</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Output Format
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none">
                <option>Individual PDFs (ZIP)</option>
                <option>Combined PDF</option>
                <option>Excel Workbook</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Batch Size
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none">
                <option>25 documents</option>
                <option>50 documents</option>
                <option>100 documents</option>
                <option>No limit</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Email notification when complete</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Auto-delete files after 7 days</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Include generation timestamp</span>
            </label>
          </div>
        </div>
      </Card>
    </div>
  );
};

// PDF Generation Form Component
const PDFGenerationForm: React.FC<{
  type: string;
  onClose: () => void;
  onSuccess: (results: any) => void;
}> = ({ type, onClose, onSuccess }) => {
  const [options, setOptions] = useState({
    format: 'pdf',
    includeCharts: true,
    includeDetails: true,
    dateRange: 'last30',
  });

  const { execute: generatePDF, loading, error } = useAsyncAction(
    async (options: any) => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { url: 'https://example.com/generated.pdf', pages: 15 };
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const results = await generatePDF(options);
      onSuccess(results);
    } catch (error) {
      console.error('PDF generation failed:', error);
    }
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
            Format
          </label>
          <select
            value={options.format}
            onChange={(e) => setOptions({ ...options, format: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          >
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
            <option value="csv">CSV</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <select
            value={options.dateRange}
            onChange={(e) => setOptions({ ...options, dateRange: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          >
            <option value="last7">Last 7 days</option>
            <option value="last30">Last 30 days</option>
            <option value="last90">Last 90 days</option>
            <option value="thisYear">This year</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.includeCharts}
            onChange={(e) => setOptions({ ...options, includeCharts: e.target.checked })}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="ml-2 text-sm text-gray-700">Include charts and graphs</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.includeDetails}
            onChange={(e) => setOptions({ ...options, includeDetails: e.target.checked })}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="ml-2 text-sm text-gray-700">Include detailed data tables</span>
        </label>
      </div>

      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={loading}>
          <FileText className="w-4 h-4 mr-2" />
          Generate {type}
        </Button>
      </div>
    </form>
  );
};

// Generation Results Component
const GenerationResults: React.FC<{ results: any }> = ({ results }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">PDF Generated Successfully</h3>
        <p className="text-gray-600 mt-1">{results.pages} pages generated</p>
      </div>

      <div className="flex justify-center space-x-3">
        <Button variant="outline" onClick={() => window.open(results.url, '_blank')}>
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>
        <Button onClick={() => window.open(results.url, '_blank')}>
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>

      <div className="flex justify-center space-x-3">
        <Button variant="ghost" size="sm">
          <Mail className="w-4 h-4 mr-2" />
          Email
        </Button>
        <Button variant="ghost" size="sm">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
};