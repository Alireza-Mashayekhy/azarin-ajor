'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as yup from 'yup';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { apiWithAuth } from '@/services/api';
import { CategoryFormData } from '@/types/category';

interface AddCategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const schema = yup.object({
    slug: yup
        .string()
        .required('Slug is required')
        .matches(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
    faTitle: yup.string().required('Persian title is required'),
    enTitle: yup.string().required('English title is required')
});

export default function AddCategoryDialog({ open, onOpenChange }: AddCategoryDialogProps) {
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<CategoryFormData>({
        resolver: yupResolver(schema) as any,
        defaultValues: {
            slug: '',
            faTitle: '',
            enTitle: ''
        }
    });

    const createMutation = useMutation({
        mutationFn: async (data: CategoryFormData) => {
            const response = await apiWithAuth.post('/admin/category', {
                slug: data.slug,
                translations: [
                    {
                        locale: 'fa',
                        title: data.faTitle
                    },
                    {
                        locale: 'en',
                        title: data.enTitle
                    }
                ]
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Category created successfully');
            reset();
            onOpenChange(false);
        },
        onError: (error: any) => {
            console.error('Error creating category:', error);
            toast.error('Failed to create category');
        }
    });

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            await createMutation.mutateAsync(data as CategoryFormData);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle className='flex items-center justify-between'>
                        <span>Create New Category</span>
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    {/* Slug */}
                    <div className='space-y-2'>
                        <label htmlFor='slug' className='text-sm font-medium text-gray-900'>
                            Slug *
                        </label>
                        <Controller
                            name='slug'
                            control={control}
                            render={({ field }) => (
                                <Input
                                    id='slug'
                                    placeholder='category-slug'
                                    {...field}
                                    onChange={(e) => {
                                        const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                                        field.onChange(value);
                                    }}
                                />
                            )}
                        />
                        {errors.slug && <p className='text-sm text-red-600'>{errors.slug.message}</p>}
                    </div>

                    {/* Persian Translation */}
                    <div className='space-y-4'>
                        <h3 className='text-lg font-medium text-gray-900'>Persian (فارسی)</h3>

                        <div className='space-y-2'>
                            <label htmlFor='faTitle' className='text-sm font-medium text-gray-900'>
                                Title *
                            </label>
                            <Controller
                                name='faTitle'
                                control={control}
                                render={({ field }) => (
                                    <Input id='faTitle' placeholder='عنوان دسته‌بندی' {...field} />
                                )}
                            />
                            {errors.faTitle && (
                                <p className='text-sm text-red-600'>{errors.faTitle.message}</p>
                            )}
                        </div>
                    </div>

                    {/* English Translation */}
                    <div className='space-y-4'>
                        <h3 className='text-lg font-medium text-gray-900'>English</h3>

                        <div className='space-y-2'>
                            <label htmlFor='enTitle' className='text-sm font-medium text-gray-900'>
                                Title *
                            </label>
                            <Controller
                                name='enTitle'
                                control={control}
                                render={({ field }) => (
                                    <Input id='enTitle' placeholder='Category Title' {...field} />
                                )}
                            />
                            {errors.enTitle && (
                                <p className='text-sm text-red-600'>{errors.enTitle.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className='flex justify-end space-x-3 pt-4'>
                        <Button type='button' variant='outline' onClick={handleClose} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type='submit' disabled={isSubmitting}>
                            {isSubmitting ? 'Creating...' : 'Create Category'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
