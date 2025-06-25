import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../Common/Button';
import { Input } from '../Common/Input';
import { Select } from '../Common/Select';
import { z } from 'zod';
import { storeAdminService } from '../../services/storeAdmin.service';
import type { StoreAdmin } from '../../types/store-admin.types';

// Schema
const formSchema = z.object({
  id: z.string(),
  email: z.string().email('Invalid email'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['ADMIN', 'MANAGER', 'STAFF'] as const),
});

export type EditStoreAdminFormValues = z.infer<typeof formSchema>;

interface Props {
  admin: StoreAdmin;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const EditStoreAdminForm: React.FC<Props> = ({ admin, onSuccess, onError }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<EditStoreAdminFormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: admin,
  });

  useEffect(() => {
    reset(admin);
  }, [admin, reset]);

  const onSubmit: SubmitHandler<EditStoreAdminFormValues> = async (data) => {
    try {
      setIsSubmitting(true);
      await storeAdminService.updateStoreAdmin(data.id, data);
      onSuccess?.();
    } catch (err) {
      console.error(err);
      onError?.(err as Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Full Name" type="text" {...register('name')} error={errors.name?.message} />

      <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />

      <Select
        label="Role"
        options={[
          { label: 'Admin', value: 'ADMIN' },
          { label: 'Manager', value: 'MANAGER' },
          { label: 'Staff', value: 'STAFF' },
        ]}
        {...register('role')}
      />

      <div className="flex justify-end gap-2">
        <Button type="submit" isLoading={isSubmitting}>
          Save
        </Button>
      </div>
    </form>
  );
};

export default EditStoreAdminForm;
