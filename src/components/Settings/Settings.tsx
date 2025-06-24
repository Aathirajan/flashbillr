import React, { useState } from 'react';
import { User, Store, Bell, Shield, Palette, Globe, Save, Eye, EyeOff } from 'lucide-react';
import { Card } from '../Common/Card';
import { Button } from '../Common/Button';
import { useAuth } from '../../hooks/useAuth';
import { useAsyncAction } from '../../hooks/useApi';
import { clsx } from 'clsx';

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [hasChanges, setHasChanges] = useState(false);

  const tabs = user?.role === 'superadmin' ? [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'platform', label: 'Platform', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ] : [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'store', label: 'Store', icon: Store },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">
            {user?.role === 'superadmin' ? 'Manage platform and account settings' : 'Manage your store and account settings'}
          </p>
        </div>
        {hasChanges && (
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="lg:w-64">
          <Card padding="sm">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={clsx(
                      'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    )}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          {activeTab === 'profile' && <ProfileSettings onChanges={setHasChanges} />}
          {activeTab === 'store' && <StoreSettings onChanges={setHasChanges} />}
          {activeTab === 'platform' && <PlatformSettings onChanges={setHasChanges} />}
          {activeTab === 'notifications' && <NotificationSettings onChanges={setHasChanges} />}
          {activeTab === 'security' && <SecuritySettings onChanges={setHasChanges} />}
          {activeTab === 'appearance' && <AppearanceSettings onChanges={setHasChanges} />}
        </div>
      </div>
    </div>
  );
};

// Profile Settings Component
const ProfileSettings: React.FC<{ onChanges: (hasChanges: boolean) => void }> = ({ onChanges }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    timezone: 'UTC',
    language: 'en',
  });

  useAsyncAction(
        async () => {
            // await userService.updateProfile(data);
            onChanges(false);
        }
    );

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    onChanges(true);
  };

  return (
    <Card>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timezone
            </label>
            <select
              value={formData.timezone}
              onChange={(e) => handleChange('timezone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="Asia/Kolkata">India Standard Time</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select
            value={formData.language}
            onChange={(e) => handleChange('language', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="hi">Hindi</option>
          </select>
        </div>
      </div>
    </Card>
  );
};

// Store Settings Component
const StoreSettings: React.FC<{ onChanges: (hasChanges: boolean) => void }> = ({ onChanges }) => {
  const [formData, setFormData] = useState({
    storeName: 'My Store',
    storeDescription: 'A modern e-commerce store',
    storeAddress: '123 Main St, City, State 12345',
    storePhone: '+1 (555) 123-4567',
    storeEmail: 'contact@mystore.com',
    currency: 'USD',
    taxRate: '8.5',
    shippingZones: ['US', 'CA'],
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    onChanges(true);
  };

  return (
    <Card>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Store Configuration</h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Store Name
            </label>
            <input
              type="text"
              value={formData.storeName}
              onChange={(e) => handleChange('storeName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Store Email
            </label>
            <input
              type="email"
              value={formData.storeEmail}
              onChange={(e) => handleChange('storeEmail', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Store Description
          </label>
          <textarea
            value={formData.storeDescription}
            onChange={(e) => handleChange('storeDescription', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Store Address
            </label>
            <input
              type="text"
              value={formData.storeAddress}
              onChange={(e) => handleChange('storeAddress', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Store Phone
            </label>
            <input
              type="tel"
              value={formData.storePhone}
              onChange={(e) => handleChange('storePhone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Currency
            </label>
            <select
              value={formData.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="INR">INR - Indian Rupee</option>
              <option value="CAD">CAD - Canadian Dollar</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.taxRate}
              onChange={(e) => handleChange('taxRate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

// Platform Settings Component (Super Admin only)
const PlatformSettings: React.FC<{ onChanges: (hasChanges: boolean) => void }> = ({ onChanges }) => {
  const [formData, setFormData] = useState({
    platformName: 'Flashbillr',
    supportEmail: 'support@flashbillr.com',
    maintenanceMode: false,
    allowRegistrations: true,
    defaultPlan: 'basic',
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    onChanges(true);
  };

  return (
    <Card>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Platform Settings</h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platform Name
            </label>
            <input
              type="text"
              value={formData.platformName}
              onChange={(e) => handleChange('platformName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Support Email
            </label>
            <input
              type="email"
              value={formData.supportEmail}
              onChange={(e) => handleChange('supportEmail', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Plan for New Stores
          </label>
          <select
            value={formData.defaultPlan}
            onChange={(e) => handleChange('defaultPlan', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          >
            <option value="basic">Basic</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.maintenanceMode}
              onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Enable maintenance mode</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.allowRegistrations}
              onChange={(e) => handleChange('allowRegistrations', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Allow new store registrations</span>
          </label>
        </div>
      </div>
    </Card>
  );
};

// Notification Settings Component
const NotificationSettings: React.FC<{ onChanges: (hasChanges: boolean) => void }> = ({ onChanges }) => {
  const [settings, setSettings] = useState({
    emailNotifications: {
      newOrders: true,
      lowStock: true,
      customerMessages: true,
      systemUpdates: false,
      marketingEmails: false,
    },
    pushNotifications: {
      newOrders: true,
      lowStock: true,
      customerMessages: false,
      systemUpdates: true,
    },
    smsNotifications: {
      newOrders: false,
      lowStock: true,
      customerMessages: false,
    },
  });

  const handleChange = (category: string, setting: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));
    onChanges(true);
  };

  return (
    <Card>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
      
      <div className="space-y-8">
        {/* Email Notifications */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h3>
          <div className="space-y-3">
            {Object.entries(settings.emailNotifications).map(([key, value]) => (
              <label key={key} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handleChange('emailNotifications', key, e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Push Notifications */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Push Notifications</h3>
          <div className="space-y-3">
            {Object.entries(settings.pushNotifications).map(([key, value]) => (
              <label key={key} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handleChange('pushNotifications', key, e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </label>
            ))}
          </div>
        </div>

        {/* SMS Notifications */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">SMS Notifications</h3>
          <div className="space-y-3">
            {Object.entries(settings.smsNotifications).map(([key, value]) => (
              <label key={key} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handleChange('smsNotifications', key, e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

// Security Settings Component
const SecuritySettings: React.FC<{ onChanges: (hasChanges: boolean) => void }> = ({ onChanges }) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    onChanges(true);
  };

  return (
    <Card>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h2>
      
      <div className="space-y-8">
        {/* Change Password */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
            <Button size="sm">Update Password</Button>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Enable 2FA</p>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={(e) => {
                  setTwoFactorEnabled(e.target.checked);
                  onChanges(true);
                }}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </label>
          </div>
        </div>

        {/* Login Sessions */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Sessions</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Current Session</p>
                <p className="text-sm text-gray-600">Chrome on Windows • 192.168.1.100</p>
              </div>
              <span className="text-sm text-green-600 font-medium">Active</span>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Mobile App</p>
                <p className="text-sm text-gray-600">iOS App • Last active 2 hours ago</p>
              </div>
              <Button variant="outline" size="sm">Revoke</Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Appearance Settings Component
const AppearanceSettings: React.FC<{ onChanges: (hasChanges: boolean) => void }> = ({ onChanges }) => {
  const [settings, setSettings] = useState({
    theme: 'light',
    colorScheme: 'blue',
    compactMode: false,
    showAnimations: true,
  });

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    onChanges(true);
  };

  return (
    <Card>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Appearance Settings</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Theme
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['light', 'dark', 'auto'].map((theme) => (
              <label key={theme} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="theme"
                  value={theme}
                  checked={settings.theme === theme}
                  onChange={(e) => handleChange('theme', e.target.value)}
                  className="mr-3"
                />
                <span className="capitalize">{theme}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Color Scheme
          </label>
          <div className="grid grid-cols-4 gap-3">
            {[
              { name: 'blue', color: 'bg-blue-500' },
              { name: 'green', color: 'bg-green-500' },
              { name: 'purple', color: 'bg-purple-500' },
              { name: 'red', color: 'bg-red-500' },
            ].map((scheme) => (
              <label key={scheme.name} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="colorScheme"
                  value={scheme.name}
                  checked={settings.colorScheme === scheme.name}
                  onChange={(e) => handleChange('colorScheme', e.target.value)}
                  className="mr-3"
                />
                <div className={`w-4 h-4 rounded-full ${scheme.color} mr-2`}></div>
                <span className="capitalize">{scheme.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-700">Compact Mode</span>
              <p className="text-xs text-gray-500">Reduce spacing and padding</p>
            </div>
            <input
              type="checkbox"
              checked={settings.compactMode}
              onChange={(e) => handleChange('compactMode', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
          </label>
          <label className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-700">Show Animations</span>
              <p className="text-xs text-gray-500">Enable smooth transitions and animations</p>
            </div>
            <input
              type="checkbox"
              checked={settings.showAnimations}
              onChange={(e) => handleChange('showAnimations', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
          </label>
        </div>
      </div>
    </Card>
  );
};