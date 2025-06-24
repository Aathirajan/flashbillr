import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings, 
  Store,
  Webhook,
  CreditCard,
  Download,
  UserCog,
  Activity,
  Database,
  Key,
  Building2,
  Crown,
  Receipt
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { clsx } from 'clsx';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  roles: ('admin' | 'superadmin')[];
  section?: string;
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'superadmin'] },
  
  // Store Management (Admin)
  { id: 'products', label: 'Products', icon: Package, roles: ['admin'], section: 'Store Management' },
  { id: 'orders', label: 'Orders', icon: ShoppingCart, roles: ['admin'] },
  { id: 'customers', label: 'Customers', icon: Users, roles: ['admin'] },
  { id: 'billing', label: 'Billing & Invoicing', icon: Receipt, roles: ['admin'] },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, roles: ['admin'] },
  { id: 'bulk', label: 'Bulk Operations', icon: Database, roles: ['admin'] },
  { id: 'webhooks', label: 'Webhooks', icon: Webhook, roles: ['admin'] },
  { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard, roles: ['admin'] },
  { id: 'pdf', label: 'PDF Reports', icon: Download, roles: ['admin'] },
  { id: 'wholesale', label: 'Wholesale', icon: Building2, roles: ['admin'] },
  
  // Platform Management (SuperAdmin)
  { id: 'stores', label: 'All Stores', icon: Store, roles: ['superadmin'], section: 'Platform Management' },
  { id: 'plans', label: 'Subscription Plans', icon: Crown, roles: ['superadmin'] },
  { id: 'system', label: 'System Config', icon: Settings, roles: ['superadmin'] },
  { id: 'api-keys', label: 'API Keys', icon: Key, roles: ['superadmin'] },
  { id: 'activity', label: 'Activity Logs', icon: Activity, roles: ['superadmin'] },
  { id: 'super-admins', label: 'Super Admins', icon: UserCog, roles: ['superadmin'] },
  
  // Settings (Both)
  { id: 'settings', label: 'Settings', icon: Settings, roles: ['admin', 'superadmin'], section: 'Settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { user } = useAuth();

  const filteredItems = menuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  const groupedItems = filteredItems.reduce((acc, item) => {
    const section = item.section || 'Main';
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              Flashbillr
            </h1>
            <p className="text-xs text-gray-400">
              {user?.role === 'superadmin' ? 'Super Admin' : 'Admin Panel'}
            </p>
          </div>
        </div>

        <nav className="space-y-6">
          {Object.entries(groupedItems).map(([section, items]) => (
            <div key={section}>
              {section !== 'Main' && (
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  {section}
                </h3>
              )}
              <div className="space-y-1">
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => onTabChange(item.id)}
                      className={clsx(
                        'w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
                        isActive
                          ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      )}
                    >
                      <Icon className={clsx(
                        'w-5 h-5 transition-transform duration-200',
                        isActive ? 'scale-110' : 'group-hover:scale-105'
                      )} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};