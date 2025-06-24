import React, { useState } from 'react';
import { Plus, Search, Receipt, User, CreditCard, FileText, Calculator, Printer, Mail, Download, Edit, Trash2, Eye } from 'lucide-react';
import { Card } from '../Common/Card';
import { Button } from '../Common/Button';
import { Modal } from '../Common/Modal';
import { useAsyncAction } from '../../hooks/useApi';
import { clsx } from 'clsx';

interface WalkInCustomer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
}

interface InvoiceItem {
  id: string;
  productId?: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  tax?: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId?: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAddress?: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: 'cash' | 'card' | 'upi' | 'bank_transfer';
  paymentStatus: 'paid' | 'pending' | 'partial';
  notes?: string;
  createdAt: string;
  dueDate?: string;
}

export const BillingModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'new-invoice' | 'invoices' | 'customers'>('new-invoice');
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isViewInvoiceModalOpen, setIsViewInvoiceModalOpen] = useState(false);

  const tabs = [
    { id: 'new-invoice' as const, label: 'New Invoice', icon: Plus },
    { id: 'invoices' as const, label: 'All Invoices', icon: Receipt },
    { id: 'customers' as const, label: 'Walk-in Customers', icon: User },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Billing & Invoicing</h1>
        <p className="text-gray-600 mt-1">Manage walk-in customers and generate invoices</p>
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
          {activeTab === 'new-invoice' && <NewInvoiceForm />}
          {activeTab === 'invoices' && <InvoiceList onViewInvoice={(invoice) => {
            setSelectedInvoice(invoice);
            setIsViewInvoiceModalOpen(true);
          }} />}
          {activeTab === 'customers' && <WalkInCustomerList />}
        </div>
      </Card>

      {/* Add Customer Modal */}
      <Modal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        title="Add Walk-in Customer"
        size="md"
      >
        <AddCustomerForm onClose={() => setIsCustomerModalOpen(false)} />
      </Modal>

      {/* View Invoice Modal */}
      <Modal
        isOpen={isViewInvoiceModalOpen}
        onClose={() => setIsViewInvoiceModalOpen(false)}
        title="Invoice Details"
        size="xl"
      >
        {selectedInvoice && <InvoiceDetails invoice={selectedInvoice} />}
      </Modal>
    </div>
  );
};

// New Invoice Form Component
const NewInvoiceForm: React.FC = () => {
  const [invoiceData, setInvoiceData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: '',
    paymentMethod: 'cash' as const,
    notes: '',
    discountPercent: 0,
    taxPercent: 18,
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', name: '', description: '', quantity: 1, price: 0 }
  ]);

  const { execute: createInvoice, loading } = useAsyncAction(
    async (data: any) => {
      // Mock invoice creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { invoiceId: 'INV-001', invoiceNumber: 'INV-2024-001' };
    }
  );

  const addItem = () => {
    setItems(prev => [...prev, {
      id: Date.now().toString(),
      name: '',
      description: '',
      quantity: 1,
      price: 0
    }]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: string, value: any) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const discountAmount = (subtotal * invoiceData.discountPercent) / 100;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = (taxableAmount * invoiceData.taxPercent) / 100;
    const total = taxableAmount + taxAmount;

    return { subtotal, discountAmount, taxAmount, total };
  };

  const { subtotal, discountAmount, taxAmount, total } = calculateTotals();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await createInvoice({
        ...invoiceData,
        items,
        subtotal,
        discountAmount,
        taxAmount,
        totalAmount: total
      });
      alert(`Invoice ${result.invoiceNumber} created successfully!`);
      // Reset form
      setInvoiceData({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        customerAddress: '',
        paymentMethod: 'cash',
        notes: '',
        discountPercent: 0,
        taxPercent: 18,
      });
      setItems([{ id: '1', name: '', description: '', quantity: 1, price: 0 }]);
    } catch (error) {
      console.error('Failed to create invoice:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Information */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Name *
            </label>
            <input
              type="text"
              required
              value={invoiceData.customerName}
              onChange={(e) => setInvoiceData({ ...invoiceData, customerName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="Enter customer name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={invoiceData.customerPhone}
              onChange={(e) => setInvoiceData({ ...invoiceData, customerPhone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={invoiceData.customerEmail}
              onChange={(e) => setInvoiceData({ ...invoiceData, customerEmail: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="customer@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              value={invoiceData.customerAddress}
              onChange={(e) => setInvoiceData({ ...invoiceData, customerAddress: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="Customer address"
            />
          </div>
        </div>
      </Card>

      {/* Invoice Items */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Invoice Items</h3>
          <Button type="button" onClick={addItem} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
        
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 items-end p-4 border border-gray-200 rounded-lg">
              <div className="col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={item.name}
                  onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="Item name"
                />
              </div>
              <div className="col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="Description"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={item.price}
                  onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="col-span-1">
                {items.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(item.id)}
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

      {/* Calculations & Payment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment & Notes</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                value={invoiceData.paymentMethod}
                onChange={(e) => setInvoiceData({ ...invoiceData, paymentMethod: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={invoiceData.notes}
                onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                rows={3}
                placeholder="Additional notes..."
              />
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Summary</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={invoiceData.discountPercent}
                  onChange={(e) => setInvoiceData({ ...invoiceData, discountPercent: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={invoiceData.taxPercent}
                  onChange={(e) => setInvoiceData({ ...invoiceData, taxPercent: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount ({invoiceData.discountPercent}%):</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Tax ({invoiceData.taxPercent}%):</span>
                <span className="font-medium">${taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline">
          Save as Draft
        </Button>
        <Button type="submit" isLoading={loading}>
          <Receipt className="w-4 h-4 mr-2" />
          Create Invoice
        </Button>
      </div>
    </form>
  );
};

// Invoice List Component
const InvoiceList: React.FC<{ onViewInvoice: (invoice: Invoice) => void }> = ({ onViewInvoice }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Mock invoices data
  const invoices: Invoice[] = [
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      customerName: 'John Doe',
      customerPhone: '+1 (555) 123-4567',
      customerEmail: 'john@example.com',
      items: [
        { id: '1', name: 'Product A', quantity: 2, price: 50 },
        { id: '2', name: 'Product B', quantity: 1, price: 30 }
      ],
      subtotal: 130,
      taxAmount: 23.4,
      discountAmount: 0,
      totalAmount: 153.4,
      paymentMethod: 'cash',
      paymentStatus: 'paid',
      createdAt: '2024-01-20T10:30:00Z'
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-002',
      customerName: 'Jane Smith',
      customerPhone: '+1 (555) 987-6543',
      items: [
        { id: '1', name: 'Service A', quantity: 1, price: 100 }
      ],
      subtotal: 100,
      taxAmount: 18,
      discountAmount: 10,
      totalAmount: 108,
      paymentMethod: 'card',
      paymentStatus: 'pending',
      createdAt: '2024-01-20T14:15:00Z'
    }
  ];

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || invoice.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        >
          <option value="">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="partial">Partial</option>
        </select>
      </div>

      {/* Invoice List */}
      <div className="space-y-3">
        {filteredInvoices.map((invoice) => (
          <div key={invoice.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex items-center flex-1">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg mr-3 flex items-center justify-center">
                <Receipt className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{invoice.invoiceNumber}</h3>
                <p className="text-sm text-gray-600">{invoice.customerName}</p>
                <p className="text-xs text-gray-500">{new Date(invoice.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium text-gray-900">${invoice.totalAmount.toFixed(2)}</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  invoice.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                  invoice.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {invoice.paymentStatus}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewInvoice(invoice)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                >
                  <Printer className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                >
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Walk-in Customer List Component
const WalkInCustomerList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Mock customers data
  const customers: WalkInCustomer[] = [
    {
      id: '1',
      name: 'John Doe',
      phone: '+1 (555) 123-4567',
      email: 'john@example.com',
      address: '123 Main St, City, State 12345'
    },
    {
      id: '2',
      name: 'Jane Smith',
      phone: '+1 (555) 987-6543',
      email: 'jane@example.com'
    }
  ];

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.phone && customer.phone.includes(searchTerm)) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Customer List */}
      <div className="space-y-3">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{customer.name}</h3>
                {customer.phone && <p className="text-sm text-gray-600">{customer.phone}</p>}
                {customer.email && <p className="text-sm text-gray-600">{customer.email}</p>}
                {customer.address && <p className="text-xs text-gray-500">{customer.address}</p>}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Customer Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Walk-in Customer"
        size="md"
      >
        <AddCustomerForm onClose={() => setIsAddModalOpen(false)} />
      </Modal>
    </div>
  );
};

// Add Customer Form Component
const AddCustomerForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });

  const { execute: addCustomer, loading } = useAsyncAction(
    async (data: any) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { customerId: 'CUST-001' };
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addCustomer(formData);
      alert('Customer added successfully!');
      onClose();
    } catch (error) {
      console.error('Failed to add customer:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Customer Name *
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          placeholder="Enter customer name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          placeholder="+1 (555) 123-4567"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          placeholder="customer@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address
        </label>
        <textarea
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          rows={3}
          placeholder="Customer address"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={loading}>
          Add Customer
        </Button>
      </div>
    </form>
  );
};

// Invoice Details Component
const InvoiceDetails: React.FC<{ invoice: Invoice }> = ({ invoice }) => {
  return (
    <div className="space-y-6">
      {/* Invoice Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{invoice.invoiceNumber}</h2>
          <p className="text-gray-600">Created on {new Date(invoice.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm">
            <Mail className="w-4 h-4 mr-2" />
            Email
          </Button>
        </div>
      </div>

      {/* Customer & Payment Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card padding="sm">
          <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
          <div className="space-y-2">
            <p className="text-gray-900">{invoice.customerName}</p>
            {invoice.customerPhone && <p className="text-gray-600">{invoice.customerPhone}</p>}
            {invoice.customerEmail && <p className="text-gray-600">{invoice.customerEmail}</p>}
            {invoice.customerAddress && <p className="text-gray-600">{invoice.customerAddress}</p>}
          </div>
        </Card>

        <Card padding="sm">
          <h3 className="font-semibold text-gray-900 mb-3">Payment Information</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method:</span>
              <span className="text-gray-900 capitalize">{invoice.paymentMethod.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                invoice.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                invoice.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {invoice.paymentStatus}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Invoice Items */}
      <Card padding="sm">
        <h3 className="font-semibold text-gray-900 mb-4">Invoice Items</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 font-medium text-gray-700">Item</th>
                <th className="text-left py-2 font-medium text-gray-700">Description</th>
                <th className="text-right py-2 font-medium text-gray-700">Qty</th>
                <th className="text-right py-2 font-medium text-gray-700">Price</th>
                <th className="text-right py-2 font-medium text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="py-3 text-gray-900">{item.name}</td>
                  <td className="py-3 text-gray-600">{item.description || '-'}</td>
                  <td className="py-3 text-right text-gray-900">{item.quantity}</td>
                  <td className="py-3 text-right text-gray-900">${item.price.toFixed(2)}</td>
                  <td className="py-3 text-right text-gray-900">${(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Invoice Summary */}
      <Card padding="sm">
        <h3 className="font-semibold text-gray-900 mb-4">Invoice Summary</h3>
        <div className="space-y-2 max-w-sm ml-auto">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span className="text-gray-900">${invoice.subtotal.toFixed(2)}</span>
          </div>
          {invoice.discountAmount > 0 && (
            <div className="flex justify-between text-red-600">
              <span>Discount:</span>
              <span>-${invoice.discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Tax:</span>
            <span className="text-gray-900">${invoice.taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span>Total:</span>
            <span>${invoice.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </Card>

      {/* Notes */}
      {invoice.notes && (
        <Card padding="sm">
          <h3 className="font-semibold text-gray-900 mb-3">Notes</h3>
          <p className="text-gray-700">{invoice.notes}</p>
        </Card>
      )}
    </div>
  );
};