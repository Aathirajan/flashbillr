import React, { useState } from 'react';
import { Activity, Filter, Download, Search, User, Store, Calendar, AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import { Card } from '../Common/Card';
import { Button } from '../Common/Button';
import { useApi } from '../../hooks/useApi';
import { systemService } from '../../services/system';
import { clsx } from 'clsx';

export const ActivityLogs: React.FC = () => {
  const [filters, setFilters] = useState({
    action: '',
    storeId: '',
    userId: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 50
  });

  const [searchTerm, setSearchTerm] = useState('');

  const { data: logsData, loading, error, refetch } = useApi(
    () => systemService.getActivityLogs(filters),
    [filters]
  );

  // Mock data for demonstration
  const activityLogs = [
    {
      id: '1',
      action: 'STORE_CREATED',
      userId: 'user_123',
      userName: 'John Doe',
      userEmail: 'john@example.com',
      storeId: 'store_456',
      storeName: 'TechStore Pro',
      timestamp: '2024-01-20T14:30:00Z',
      details: { storeName: 'TechStore Pro', plan: 'Pro' },
      severity: 'info'
    },
    {
      id: '2',
      action: 'USER_LOGIN',
      userId: 'admin_789',
      userName: 'Admin User',
      userEmail: 'admin@vectorlab.in',
      storeId: null,
      storeName: null,
      timestamp: '2024-01-20T14:25:00Z',
      details: { ipAddress: '192.168.1.100', userAgent: 'Chrome/120.0.0.0' },
      severity: 'info'
    },
    {
      id: '3',
      action: 'PLAN_UPGRADED',
      userId: 'user_456',
      userName: 'Jane Smith',
      userEmail: 'jane@fashionhub.com',
      storeId: 'store_789',
      storeName: 'Fashion Hub',
      timestamp: '2024-01-20T13:15:00Z',
      details: { fromPlan: 'Basic', toPlan: 'Pro' },
      severity: 'success'
    },
    {
      id: '4',
      action: 'FAILED_LOGIN',
      userId: null,
      userName: 'Unknown',
      userEmail: 'unknown@email.com',
      storeId: null,
      storeName: null,
      timestamp: '2024-01-20T12:45:00Z',
      details: { ipAddress: '192.168.1.200', reason: 'Invalid credentials' },
      severity: 'warning'
    },
    {
      id: '5',
      action: 'STORE_SUSPENDED',
      userId: 'admin_789',
      userName: 'Admin User',
      userEmail: 'admin@vectorlab.in',
      storeId: 'store_999',
      storeName: 'Suspended Store',
      timestamp: '2024-01-20T11:30:00Z',
      details: { reason: 'Policy violation', suspendedBy: 'admin_789' },
      severity: 'error'
    },
    {
      id: '6',
      action: 'API_KEY_CREATED',
      userId: 'admin_789',
      userName: 'Admin User',
      userEmail: 'admin@vectorlab.in',
      storeId: null,
      storeName: null,
      timestamp: '2024-01-20T10:15:00Z',
      details: { keyName: 'Analytics API Key', permissions: ['read'] },
      severity: 'info'
    }
  ];

  const actionTypes = [
    'STORE_CREATED',
    'STORE_UPDATED',
    'STORE_SUSPENDED',
    'USER_LOGIN',
    'USER_LOGOUT',
    'FAILED_LOGIN',
    'PLAN_UPGRADED',
    'PLAN_DOWNGRADED',
    'API_KEY_CREATED',
    'API_KEY_REVOKED',
    'PAYMENT_SUCCESS',
    'PAYMENT_FAILED'
  ];

  const severityConfig = {
    info: { color: 'bg-blue-100 text-blue-800', icon: Info, label: 'Info' },
    success: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Success' },
    warning: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle, label: 'Warning' },
    error: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Error' },
  };

  const formatActionName = (action: string) => {
    return action.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const exportLogs = () => {
    // Mock export functionality
    alert('Exporting activity logs...');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Activity Logs</h1>
          <p className="text-gray-600 mt-1">Monitor system-wide activity and user actions</p>
        </div>
        <Button onClick={exportLogs}>
          <Download className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Activity Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card padding="sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-4">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-4">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Success Events</p>
              <p className="text-2xl font-bold text-gray-900">1,156</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mr-4">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Warnings</p>
              <p className="text-2xl font-bold text-gray-900">67</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center mr-4">
              <XCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Errors</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search logs by user, store, or action..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filters.action}
              onChange={(e) => setFilters(prev => ({ ...prev, action: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="">All Actions</option>
              {actionTypes.map(action => (
                <option key={action} value={action}>{formatActionName(action)}</option>
              ))}
            </select>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Activity Logs List */}
        <div className="space-y-3">
          {activityLogs.map((log) => {
            const severityInfo = severityConfig[log.severity as keyof typeof severityConfig];
            const SeverityIcon = severityInfo.icon;
            
            return (
              <div key={log.id} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-start flex-1">
                  <div className={`w-3 h-3 rounded-full mr-3 mt-2 ${
                    log.severity === 'success' ? 'bg-green-500' :
                    log.severity === 'warning' ? 'bg-yellow-500' :
                    log.severity === 'error' ? 'bg-red-500' :
                    'bg-blue-500'
                  }`}></div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">{formatActionName(log.action)}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${severityInfo.color}`}>
                        <SeverityIcon className="w-3 h-3 mr-1" />
                        {severityInfo.label}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        {log.userName} ({log.userEmail})
                      </div>
                      {log.storeName && (
                        <div className="flex items-center">
                          <Store className="w-3 h-3 mr-1" />
                          {log.storeName}
                        </div>
                      )}
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                    
                    {log.details && (
                      <div className="bg-gray-50 rounded-lg p-3 mt-2">
                        <h4 className="text-xs font-medium text-gray-700 mb-1">Details:</h4>
                        <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing 1 to {activityLogs.length} of {activityLogs.length} results
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};