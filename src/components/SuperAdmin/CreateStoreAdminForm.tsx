import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { storeAdminService } from '../../services/storeAdmin.service';
import { Button } from '../Common/Button';
import { Input } from '../Common/Input';
import { Select } from '../Common/Select';

const createStoreAdminSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  storeId: z.string().min(1, 'Store ID is required'),
  role: z.enum(['ADMIN', 'MANAGER', 'STAFF'] as const).default('ADMIN'),
});

type FormValues = z.infer<typeof createStoreAdminSchema>;

interface CreateStoreAdminFormProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const CreateStoreAdminForm: React.FC<CreateStoreAdminFormProps> = ({
  onSuccess,
  onError,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(createStoreAdminSchema) as any, // Type assertion to handle zod resolver types
    defaultValues: {
      role: 'ADMIN',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setIsSubmitting(true);
      await storeAdminService.createStoreAdmin(data);
      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error creating store admin:', error);
      onError?.(error as Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input label="Full Name" type="text" {...register('name')} error={errors.name?.message} />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Input label="Store ID" type="text" {...register('storeId')} error={errors.storeId?.message} />
        {errors.storeId && (
          <p className="mt-1 text-sm text-red-600">{errors.storeId.message}</p>
        )}
      </div>

      <div>
        <Select
          label="Role"
          options={[
            { label: 'Admin', value: 'ADMIN' },
            { label: 'Manager', value: 'MANAGER' },
            { label: 'Staff', value: 'STAFF' },
          ]}
          {...register('role')}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting}>
          Create Store Admin
        </Button>
      </div>
    </form>
  );
};

export default CreateStoreAdminForm;
