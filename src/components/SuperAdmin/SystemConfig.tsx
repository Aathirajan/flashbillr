import React, { useState } from 'react';
import { Settings, Save, RefreshCw, AlertCircle, CheckCircle, Server, Database, Mail, Shield } from 'lucide-react';
import { Card } from '../Common/Card';
import { Button } from '../Common/Button';
import { useApi, useAsyncAction } from '../../hooks/useApi';
import { systemService } from '../../services/system';

export const SystemConfig: React.FC = () => {
  const [hasChanges, setHasChanges] = useState(false);
  const [config, setConfig] = useState({
    platformName: 'VectorLab',
    platformVersion: '2.1.0',
    maintenanceMode: false,
    allowNewRegistrations: true,
    emailNotifications: true,
    maxStoresPerPlan: {
      basic: 1,
      pro: 5,
      enterprise: 'unlimited'
    },
    systemLimits: {
      maxProductsPerStore: 10000,
      maxOrdersPerDay: 1000,
      maxApiCallsPerHour: 5000
    },
    emailSettings: {
      smtpHost: 'smtp.vectorlab.com',
      smtpPort: 587,
      fromEmail: 'noreply@vectorlab.com',
      fromName: 'VectorLab Platform'
    },
    securitySettings: {
      sessionTimeout: 24,
      passwordMinLength: 8,
      requireTwoFactor: false,
      allowedDomains: []
    }
  });

  const { execute: updateConfig, loading: updateLoading } = useAsyncAction(
    async (newConfig: any) => {
      await systemService.updateSystemConfig(newConfig);
      setHasChanges(false);
    }
  );

  const handleConfigChange = (section: string, key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const handleDirectChange = (key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      await updateConfig(config);
      alert('System configuration updated successfully!');
    } catch (error) {
      console.error('Failed to update configuration:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Configuration</h1>
          <p className="text-gray-600 mt-1">Manage global system settings and configuration</p>
        </div>
        <div className="flex space-x-3">
          {hasChanges && (
            <div className="flex items-center text-amber-600 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              Unsaved changes
            </div>
          )}
          <Button 
            onClick={handleSave}
            isLoading={updateLoading}
            disabled={!hasChanges}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Platform Settings */}
      <Card>
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-3">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Platform Settings</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platform Name
            </label>
            <input
              type="text"
              value={config.platformName}
              onChange={(e) => handleDirectChange('platformName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platform Version
            </label>
            <input
              type="text"
              value={config.platformVersion}
              onChange={(e) => handleDirectChange('platformVersion', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
        
        <div className="mt-6 space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.maintenanceMode}
              onChange={(e) => handleDirectChange('maintenanceMode', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Enable maintenance mode</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.allowNewRegistrations}
              onChange={(e) => handleDirectChange('allowNewRegistrations', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Allow new store registrations</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.emailNotifications}
              onChange={(e) => handleDirectChange('emailNotifications', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Enable email notifications</span>
          </label>
        </div>
      </Card>

      {/* System Limits */}
      <Card>
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
            <Server className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">System Limits</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Products Per Store
            </label>
            <input
              type="number"
              value={config.systemLimits.maxProductsPerStore}
              onChange={(e) => handleConfigChange('systemLimits', 'maxProductsPerStore', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Orders Per Day
            </label>
            <input
              type="number"
              value={config.systemLimits.maxOrdersPerDay}
              onChange={(e) => handleConfigChange('systemLimits', 'maxOrdersPerDay', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max API Calls Per Hour
            </label>
            <input
              type="number"
              value={config.systemLimits.maxApiCallsPerHour}
              onChange={(e) => handleConfigChange('systemLimits', 'maxApiCallsPerHour', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      </Card>

      {/* Email Settings */}
      <Card>
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Email Settings</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMTP Host
            </label>
            <input
              type="text"
              value={config.emailSettings.smtpHost}
              onChange={(e) => handleConfigChange('emailSettings', 'smtpHost', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMTP Port
            </label>
            <input
              type="number"
              value={config.emailSettings.smtpPort}
              onChange={(e) => handleConfigChange('emailSettings', 'smtpPort', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Email
            </label>
            <input
              type="email"
              value={config.emailSettings.fromEmail}
              onChange={(e) => handleConfigChange('emailSettings', 'fromEmail', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Name
            </label>
            <input
              type="text"
              value={config.emailSettings.fromName}
              onChange={(e) => handleConfigChange('emailSettings', 'fromName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card>
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center mr-3">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Security Settings</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Timeout (hours)
            </label>
            <input
              type="number"
              value={config.securitySettings.sessionTimeout}
              onChange={(e) => handleConfigChange('securitySettings', 'sessionTimeout', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Password Length
            </label>
            <input
              type="number"
              value={config.securitySettings.passwordMinLength}
              onChange={(e) => handleConfigChange('securitySettings', 'passwordMinLength', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.securitySettings.requireTwoFactor}
              onChange={(e) => handleConfigChange('securitySettings', 'requireTwoFactor', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Require two-factor authentication for all admins</span>
          </label>
        </div>
      </Card>
    </div>
  );
};