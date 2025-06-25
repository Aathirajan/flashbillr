import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { storeAdminService } from '../../services/storeAdmin.service';
import { PASSWORD_REQUIREMENTS } from '../../config';

const setupPasswordSchema = z.object({
  password: z
    .string()
    .min(PASSWORD_REQUIREMENTS.minLength, `Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters`)
    .refine((val) => !PASSWORD_REQUIREMENTS.requireUppercase || /[A-Z]/.test(val), {
      message: 'Must contain at least one uppercase letter',
    })
    .refine((val) => !PASSWORD_REQUIREMENTS.requireLowercase || /[a-z]/.test(val), {
      message: 'Must contain at least one lowercase letter',
    })
    .refine((val) => !PASSWORD_REQUIREMENTS.requireNumbers || /\d/.test(val), {
      message: 'Must contain at least one number',
    })
    .refine(
      (val) =>
        !PASSWORD_REQUIREMENTS.requireSpecialChars ||
        new RegExp(`[${PASSWORD_REQUIREMENTS.specialChars}]`).test(val),
      {
        message: `Must contain at least one special character (${PASSWORD_REQUIREMENTS.specialChars})`,
      }
    ),
  confirmPassword: z.string(),
  token: z.string().min(1, 'Token is required'),
  email: z.string().email('Invalid email address'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SetupPasswordFormData = z.infer<typeof setupPasswordSchema>;

export const SetupPasswordForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SetupPasswordFormData>({
    resolver: zodResolver(setupPasswordSchema),
    defaultValues: {
      token,
      email,
    },
  });

  // Set form values from URL params
  useEffect(() => {
    if (token) setValue('token', token);
    if (email) setValue('email', email);
  }, [token, email, setValue]);

  const onSubmit = async (data: SetupPasswordFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await storeAdminService.setupPassword({
        token: data.token,
        email: data.email,
        password: data.password,
      });

      // Store tokens
      storeAdminService.storeTokens(
        response.tokens.accessToken,
        response.tokens.refreshToken
      );

      setSuccess(true);
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error setting up password:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to set up password. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-md bg-green-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-green-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Password set successfully!
            </h3>
            <div className="mt-2 text-sm text-green-700">
              <p>You will be redirected to the dashboard shortly.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Set up your password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please create a secure password for your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  disabled={!!email}
                  className={`block w-full appearance-none rounded-md border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                  {...register('email')}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <input type="hidden" {...register('token')} />

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  className={`block w-full appearance-none rounded-md border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                  {...register('password')}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="mt-1 text-xs text-gray-500">
                <p>Password must:</p>
                <ul className="list-disc pl-5">
                  <li>Be at least {PASSWORD_REQUIREMENTS.minLength} characters</li>
                  {PASSWORD_REQUIREMENTS.requireUppercase && (
                    <li>Contain at least one uppercase letter</li>
                  )}
                  {PASSWORD_REQUIREMENTS.requireLowercase && (
                    <li>Contain at least one lowercase letter</li>
                  )}
                  {PASSWORD_REQUIREMENTS.requireNumbers && (
                    <li>Contain at least one number</li>
                  )}
                  {PASSWORD_REQUIREMENTS.requireSpecialChars && (
                    <li>
                      Contain at least one special character (
                      {PASSWORD_REQUIREMENTS.specialChars})
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  className={`block w-full appearance-none rounded-md border ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  } px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Setting up...' : 'Set Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetupPasswordForm;
