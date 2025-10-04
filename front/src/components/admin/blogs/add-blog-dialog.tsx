'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as yup from 'yup';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { apiWithAuth } from '@/services/api';
import { BlogFormData } from '@/types/blog';
import { Category } from '@/types/category';

interface AddBlogDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const schema = yup.object({
    slug: yup
        .string()
        .required('Slug is required')
        .matches(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
    categoryId: yup.number().required('Category is required'),
    publishedAt: yup.string().required('Publish date is required'),
    faTitle: yup.string().required('Persian title is required'),
    faContent: yup.string().required('Persian content is required'),
    faExcerpt: yup.string(),
    enTitle: yup.string().required('English title is required'),
    enContent: yup.string().required('English content is required'),
    enExcerpt: yup.string()
});

export default function AddBlogDialog({ open, onOpenChange }: AddBlogDialogProps) {
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<BlogFormData>({
        resolver: yupResolver(schema) as any,
        defaultValues: {
            slug: '',
            categoryId: 0,
            publishedAt: new Date().toISOString().split('T')[0],
            faTitle: '',
            faContent: '',
            faExcerpt: '',
            enTitle: '',
            enContent: '',
            enExcerpt: ''
        }
    });

    // Fetch categories for the select dropdown
    const { data: categoriesData } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await apiWithAuth.get('/admin/category', {
                params: { page: 1, limit: 100 }
            });
            return response.data.categories;
        }
    });

    const createMutation = useMutation({
        mutationFn: async (data: BlogFormData) => {
            const response = await apiWithAuth.post('/blog/admin', {
                slug: data.slug,
                categoryId: data.categoryId,
                publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
                translations: [
                    {
                        locale: 'fa',
                        title: data.faTitle,
                        content: data.faContent,
                        excerpt: data.faExcerpt || null
                    },
                    {
                        locale: 'en',
                        title: data.enTitle,
                        content: data.enContent,
                        excerpt: data.enExcerpt || null
                    }
                ]
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] });
            toast.success('Blog created successfully');
            reset();
            onOpenChange(false);
        },
        onError: (error: any) => {
            console.error('Error creating blog:', error);
            toast.error('Failed to create blog');
        }
    });

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            await createMutation.mutateAsync(data as BlogFormData);
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
            <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>Create New Blog Post</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    {/* Basic Info */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
                                        placeholder='blog-post-slug'
                                        {...field}
                                        onChange={(e) => {
                                            const value = e.target.value
                                                .toLowerCase()
                                                .replace(/[^a-z0-9-]/g, '');
                                            field.onChange(value);
                                        }}
                                    />
                                )}
                            />
                            {errors.slug && <p className='text-sm text-red-600'>{errors.slug.message}</p>}
                        </div>

                        <div className='space-y-2'>
                            <label htmlFor='categoryId' className='text-sm font-medium text-gray-900'>
                                Category *
                            </label>
                            <Controller
                                name='categoryId'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        value={field.value.toString()}
                                        onValueChange={(value) => field.onChange(parseInt(value))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select category' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categoriesData?.map((category: Category) => {
                                                const faTranslation = category.translations.find(
                                                    (t) => t.locale === 'fa'
                                                );
                                                const enTranslation = category.translations.find(
                                                    (t) => t.locale === 'en'
                                                );
                                                const title =
                                                    faTranslation?.title ||
                                                    enTranslation?.title ||
                                                    category.slug;
                                                return (
                                                    <SelectItem
                                                        key={category.id}
                                                        value={category.id.toString()}>
                                                        {title}
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.categoryId && (
                                <p className='text-sm text-red-600'>{errors.categoryId.message}</p>
                            )}
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <label htmlFor='publishedAt' className='text-sm font-medium text-gray-900'>
                            Publish Date *
                        </label>
                        <Controller
                            name='publishedAt'
                            control={control}
                            render={({ field }) => <Input id='publishedAt' type='date' {...field} />}
                        />
                        {errors.publishedAt && (
                            <p className='text-sm text-red-600'>{errors.publishedAt.message}</p>
                        )}
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
                                    <Input id='faTitle' placeholder='عنوان مطلب' {...field} />
                                )}
                            />
                            {errors.faTitle && (
                                <p className='text-sm text-red-600'>{errors.faTitle.message}</p>
                            )}
                        </div>

                        <div className='space-y-2'>
                            <label htmlFor='faExcerpt' className='text-sm font-medium text-gray-900'>
                                Excerpt
                            </label>
                            <Controller
                                name='faExcerpt'
                                control={control}
                                render={({ field }) => (
                                    <Textarea id='faExcerpt' placeholder='خلاصه مطلب' rows={3} {...field} />
                                )}
                            />
                            {errors.faExcerpt && (
                                <p className='text-sm text-red-600'>{errors.faExcerpt.message}</p>
                            )}
                        </div>

                        <div className='space-y-2'>
                            <label htmlFor='faContent' className='text-sm font-medium text-gray-900'>
                                Content *
                            </label>
                            <Controller
                                name='faContent'
                                control={control}
                                render={({ field }) => (
                                    <Textarea id='faContent' placeholder='محتوای مطلب' rows={6} {...field} />
                                )}
                            />
                            {errors.faContent && (
                                <p className='text-sm text-red-600'>{errors.faContent.message}</p>
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
                                    <Input id='enTitle' placeholder='Blog Title' {...field} />
                                )}
                            />
                            {errors.enTitle && (
                                <p className='text-sm text-red-600'>{errors.enTitle.message}</p>
                            )}
                        </div>

                        <div className='space-y-2'>
                            <label htmlFor='enExcerpt' className='text-sm font-medium text-gray-900'>
                                Excerpt
                            </label>
                            <Controller
                                name='enExcerpt'
                                control={control}
                                render={({ field }) => (
                                    <Textarea id='enExcerpt' placeholder='Blog excerpt' rows={3} {...field} />
                                )}
                            />
                            {errors.enExcerpt && (
                                <p className='text-sm text-red-600'>{errors.enExcerpt.message}</p>
                            )}
                        </div>

                        <div className='space-y-2'>
                            <label htmlFor='enContent' className='text-sm font-medium text-gray-900'>
                                Content *
                            </label>
                            <Controller
                                name='enContent'
                                control={control}
                                render={({ field }) => (
                                    <Textarea id='enContent' placeholder='Blog content' rows={6} {...field} />
                                )}
                            />
                            {errors.enContent && (
                                <p className='text-sm text-red-600'>{errors.enContent.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className='flex justify-end space-x-3 pt-4'>
                        <Button type='button' variant='outline' onClick={handleClose} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type='submit' disabled={isSubmitting}>
                            {isSubmitting ? 'Creating...' : 'Create Blog'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
