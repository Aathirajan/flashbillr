import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../Common/Button';
import { Card } from '../Common/Card';
import { Package, Eye, EyeOff, Store } from 'lucide-react';
import { storeAdminService } from '../../services/storeAdmin.service';
import { USER_ROLES } from '../../config';

interface LoginFormData {
  email: string;
  password: string;
  storeId?: string;
  role?: string;
}

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    storeId: '',
    role: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isStoreAdmin, setIsStoreAdmin] = useState(false);
  const [showStoreIdField, setShowStoreIdField] = useState(false);
  
  // Check if the email suggests this is a store admin login
  useEffect(() => {
    const isAdminEmail = formData.email.endsWith('@flashbillr.com');
    setShowStoreIdField(isAdminEmail);
    
    if (isAdminEmail) {
      setIsStoreAdmin(true);
      setFormData(prev => ({ ...prev, role: USER_ROLES.ADMIN }));
    } else {
      setIsStoreAdmin(false);
      setFormData(prev => ({ ...prev, role: '', storeId: '' }));
    }
  }, [formData.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isStoreAdmin) {
        // Use store admin login flow
        const response = await storeAdminService.login({
          email: formData.email,
          password: formData.password,
          storeId: formData.storeId
        });
        
        // Store tokens
        storeAdminService.storeTokens(
          response.tokens.accessToken,
          response.tokens.refreshToken
        );
        
        // Update auth context
        await login(formData.email, formData.password);
      } else {
        // Regular login flow
        await login(formData.email, formData.password);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'Invalid credentials. Please check your email and password.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="backdrop-blur-sm bg-white/95">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Flashbillr Admin</h1>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Demo credentials:</p>
            <div className="space-y-1 mt-2">
              <p><strong>Store Admin:</strong> admin@flashbillr.com | password | store-123</p>
              <p><strong>Super Admin:</strong> superadmin@flashbillr.com | password</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};