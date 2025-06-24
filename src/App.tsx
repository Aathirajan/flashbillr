import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { AuthProvider } from './components/AuthProvider';
import { LoginForm } from './components/Auth/LoginForm';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { DashboardCards } from './components/Dashboard/DashboardCards';
import { AnalyticsCharts } from './components/Dashboard/AnalyticsCharts';
import { ProductList } from './components/Products/ProductList';
import { OrderList } from './components/Orders/OrderList';
import { CustomerList } from './components/Customers/CustomerList';
import { BulkOperations } from './components/Bulk/BulkOperations';
import { PDFReports } from './components/PDF/PDFReports';
import { StoreManagement } from './components/SuperAdmin/StoreManagement';
import { SubscriptionPlans } from './components/SuperAdmin/SubscriptionPlans';
import { SystemConfig } from './components/SuperAdmin/SystemConfig';
import { ApiKeyManagement } from './components/SuperAdmin/ApiKeyManagement';
import { ActivityLogs } from './components/SuperAdmin/ActivityLogs';
import { SuperAdminManagement } from './components/SuperAdmin/SuperAdminManagement';
import { Settings } from './components/Settings/Settings';
import { BillingModule } from './components/Billing/BillingModule';
import { Card } from './components/Common/Card';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Set initial tab based on user role
  useEffect(() => {
    if (user) {
      if (user.role === 'superadmin') {
        setActiveTab('stores'); // Super admins start with store management
      } else {
        setActiveTab('dashboard'); // Regular admins start with dashboard
      }
    }
  }, [user]);

  if (!user) {
    return <LoginForm />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {user.name}! Here's what's happening with your {user.role === 'superadmin' ? 'platform' : 'store'}.
              </p>
            </div>
            <DashboardCards />
            <AnalyticsCharts />
          </div>
        );
      
      case 'products':
        return <ProductList />;
        
      case 'orders':
        return <OrderList />;
        
      case 'customers':
        return <CustomerList />;
        
      case 'bulk':
        return <BulkOperations />;
        
      case 'pdf':
        return <PDFReports />;

      case 'billing':
        return <BillingModule />;
        
      case 'stores':
        return <StoreManagement />;

      case 'plans':
        return <SubscriptionPlans />;

      case 'system':
        return <SystemConfig />;

      case 'api-keys':
        return <ApiKeyManagement />;

      case 'activity':
        return <ActivityLogs />;

      case 'super-admins':
        return <SuperAdminManagement />;
        
      case 'analytics':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
            <AnalyticsCharts />
          </div>
        );
        
      case 'settings':
        return <Settings />;

      case 'wholesale':
        return (
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Wholesale Management</h2>
            <p className="text-gray-600">
              Wholesale module is under development. This will include bulk pricing, wholesale customer management, and special pricing tiers.
            </p>
          </Card>
        );

      case 'webhooks':
        return (
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Webhook Management</h2>
            <p className="text-gray-600">
              Webhook management module is under development. This will allow you to configure webhooks for various store events.
            </p>
          </Card>
        );

      case 'subscriptions':
        return (
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Subscription Management</h2>
            <p className="text-gray-600">
              Manage your store's subscription plan, view billing history, and upgrade/downgrade your plan.
            </p>
          </Card>
        );
        
      default:
        return (
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{activeTab}</h2>
            <p className="text-gray-600">This section is under development...</p>
          </Card>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;