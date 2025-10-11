'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import FormProvider from '@/components/shared/form-provider';
import { Label } from '@/components/shared/label';
import RHFEditor from '@/components/shared/rhf-editor';
import RHFInput from '@/components/shared/rhf-input';
import RHFSelect from '@/components/shared/rhf-select';
import RHFTextArea from '@/components/shared/rhf-textarea';
import { Button } from '@/components/ui/button';
import { apiWithAuth } from '@/services/api';

type TranslationForm = {
    locale: string;
    title: string;
    excerpt: string;
    content: string;
};

type BlogForm = {
    slug: string;
    categoryId: number;
    publishedAt?: string;
    coverImage?: string;
    translations: TranslationForm[];
};

export default function NewBlogPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'fa' | 'en'>('fa');
    const [coverImagePreview, setCoverImagePreview] = useState<string>('');

    const methods = useForm<BlogForm>({
        defaultValues: {
            slug: '',
            categoryId: undefined as any,
            publishedAt: '',
            coverImage: '',
            translations: [
                { locale: 'fa', title: '', excerpt: '', content: '' },
                { locale: 'en', title: '', excerpt: '', content: '' }
            ]
        },
        mode: 'onBlur'
    });

    const {
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = methods;

    const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setValue('coverImage', base64);
                setCoverImagePreview(base64);
            };
            reader.readAsDataURL(file);
        }
    };

    // Fetch categories
    const { data: categoriesData } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await apiWithAuth.get('/admin/category', {
                params: { page: 1, limit: 100 }
            });
            return response.data;
        }
    });

    // Create blog mutation
    const createMutation = useMutation({
        mutationFn: async (data: BlogForm) => {
            const response = await apiWithAuth.post('/admin/blog', data);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Blog created successfully');
            router.push('/admin/blogs');
        },
        onError: (error: any) => {
            console.error('Error creating blog:', error);
            toast.error(error.response?.data?.message || 'Failed to create blog');
        }
    });

    const onSubmit = (data: BlogForm) => {
        // Remove empty publishedAt
        if (!data.publishedAt) {
            delete data.publishedAt;
        }

        // Remove empty coverImage
        if (!data.coverImage) {
            delete data.coverImage;
        }

        createMutation.mutate(data);
    };

    // Prepare category options
    const categoryOptions =
        categoriesData?.categories?.map((category: any) => {
            const faTranslation = category.translations.find((t: any) => t.locale === 'fa');
            const enTranslation = category.translations.find((t: any) => t.locale === 'en');
            return {
                value: category.id,
                label: faTranslation?.title || enTranslation?.title || category.slug
            };
        }) || [];

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-4'>
                    <Button variant='outline' size='sm' onClick={() => router.back()}>
                        <ArrowLeft className='h-4 w-4 mr-2' />
                        Back
                    </Button>
                    <h1 className='text-2xl font-bold'>Create New Blog</h1>
                </div>
            </div>

            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                <div className='bg-white rounded-lg border p-6 space-y-4'>
                    <h2 className='text-lg font-semibold'>General Information</h2>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <RHFInput name='slug' label='Slug' placeholder='blog-post-slug' required />

                        <RHFSelect
                            name='categoryId'
                            label='Category'
                            options={categoryOptions}
                            placeholder='Select a category'
                            required
                            rules={{
                                validate: (value) => value > 0 || 'Please select a category'
                            }}
                        />
                    </div>

                    {/* Cover Image */}
                    <div className='space-y-2'>
                        <Label htmlFor='coverImage'>Cover Image</Label>
                        <input
                            type='file'
                            id='coverImage'
                            accept='image/*'
                            onChange={handleCoverImageChange}
                            className='w-full px-3 py-2 border border-input rounded-md bg-background text-sm cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90'
                        />
                        {coverImagePreview && (
                            <div className='mt-2 border rounded-md p-2 bg-muted/30'>
                                <img
                                    src={coverImagePreview}
                                    alt='Cover preview'
                                    className='max-w-full h-auto max-h-48 mx-auto rounded'
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className='bg-white rounded-lg border p-6 space-y-4'>
                    <div className='flex items-center space-x-4 border-b'>
                        <button
                            type='button'
                            onClick={() => setActiveTab('fa')}
                            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                                activeTab === 'fa'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}>
                            فارسی (FA)
                        </button>
                        <button
                            type='button'
                            onClick={() => setActiveTab('en')}
                            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                                activeTab === 'en'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}>
                            English (EN)
                        </button>
                    </div>

                    {/* Persian Translation Fields */}
                    <div className={`space-y-4 ${activeTab !== 'fa' ? 'hidden' : ''}`}>
                        <RHFInput
                            name='translations.0.title'
                            label='Title (FA)'
                            placeholder='عنوان بلاگ را وارد کنید'
                            required
                        />

                        <RHFTextArea
                            name='translations.0.excerpt'
                            label='Excerpt (FA)'
                            placeholder='توضیح کوتاه بلاگ'
                            rows={3}
                            required
                        />

                        <RHFEditor
                            name='translations.0.content'
                            label='Content (FA)'
                            placeholder='محتوای کامل بلاگ را اینجا بنویسید...'
                            required
                        />
                    </div>

                    {/* English Translation Fields */}
                    <div className={`space-y-4 ${activeTab !== 'en' ? 'hidden' : ''}`}>
                        <RHFInput
                            name='translations.1.title'
                            label='Title (EN)'
                            placeholder='Enter blog title'
                            required
                        />

                        <RHFTextArea
                            name='translations.1.excerpt'
                            label='Excerpt (EN)'
                            placeholder='Short description of the blog post'
                            rows={3}
                            required
                        />

                        <RHFEditor
                            name='translations.1.content'
                            label='Content (EN)'
                            placeholder='Write your blog content here...'
                            required
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className='flex items-center justify-end space-x-4'>
                    <Button type='button' variant='outline' onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type='submit' disabled={createMutation.isPending}>
                        {createMutation.isPending ? 'Creating...' : 'Create Blog'}
                    </Button>
                </div>
            </FormProvider>
        </div>
    );
}
