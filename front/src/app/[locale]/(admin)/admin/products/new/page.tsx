'use client';

import { useMutation } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import FormProvider from '@/components/shared/form-provider';
import { Label } from '@/components/shared/label';
import RHFInput from '@/components/shared/rhf-input';
import RHFTextArea from '@/components/shared/rhf-textarea';
import { Button } from '@/components/ui/button';
import { apiWithAuth } from '@/services/api';

type TranslationForm = {
    locale: string;
    title: string;
    description: string;
};

type ProductForm = {
    slug: string;
    price: number;
    imageUrl?: string;
    widthMm?: number;
    heightMm?: number;
    thicknessMm?: number;
    unitsPerBox?: number;
    areaPerUnit?: number;
    translations: TranslationForm[];
};

export default function NewProductPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'fa' | 'en'>('fa');
    const [imagePreview, setImagePreview] = useState<string>('');

    const methods = useForm<ProductForm>({
        defaultValues: {
            slug: '',
            price: 0,
            imageUrl: '',
            widthMm: undefined,
            heightMm: undefined,
            thicknessMm: undefined,
            unitsPerBox: undefined,
            areaPerUnit: undefined,
            translations: [
                { locale: 'fa', title: '', description: '' },
                { locale: 'en', title: '', description: '' }
            ]
        },
        mode: 'onBlur'
    });

    const {
        handleSubmit,
        setValue,
        formState: { errors }
    } = methods;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setValue('imageUrl', base64);
                setImagePreview(base64);
            };
            reader.readAsDataURL(file);
        }
    };

    // Create product mutation
    const createMutation = useMutation({
        mutationFn: async (data: ProductForm) => {
            // Clean up empty optional fields
            const cleanedData = {
                ...data,
                imageUrl: data.imageUrl || undefined,
                widthMm: data.widthMm || undefined,
                heightMm: data.heightMm || undefined,
                thicknessMm: data.thicknessMm || undefined,
                unitsPerBox: data.unitsPerBox || undefined,
                areaPerUnit: data.areaPerUnit || undefined
            };

            const response = await apiWithAuth.post('/admin/products', cleanedData);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Product created successfully');
            router.push('/admin/products');
        },
        onError: (error: any) => {
            console.error('Error creating product:', error);
            toast.error(error.response?.data?.message || 'Failed to create product');
        }
    });

    const onSubmit = (data: ProductForm) => {
        createMutation.mutate(data);
    };

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-4'>
                    <Button variant='outline' size='sm' onClick={() => router.back()}>
                        <ArrowLeft className='h-4 w-4 mr-2' />
                        Back
                    </Button>
                    <h1 className='text-2xl font-bold'>Create New Product</h1>
                </div>
            </div>

            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                <div className='bg-white rounded-lg border p-6 space-y-4'>
                    <h2 className='text-lg font-semibold'>General Information</h2>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <RHFInput name='slug' label='Slug' placeholder='product-slug' required />

                        <RHFInput
                            name='price'
                            label='Price'
                            placeholder='0.00'
                            required
                            formatNumber
                            rules={{
                                min: { value: 0, message: 'Price must be positive' }
                            }}
                        />
                    </div>

                    {/* Product Image */}
                    <div className='space-y-2'>
                        <Label htmlFor='imageUrl'>Product Image</Label>
                        <input
                            type='file'
                            id='imageUrl'
                            accept='image/*'
                            onChange={handleImageChange}
                            className='w-full px-3 py-2 border border-input rounded-md bg-background text-sm cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90'
                        />
                        {imagePreview && (
                            <div className='mt-2 border rounded-md p-2 bg-muted/30'>
                                <img
                                    src={imagePreview}
                                    alt='Product preview'
                                    className='max-w-full h-auto max-h-48 mx-auto rounded'
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Dimensions & Specifications */}
                <div className='bg-white rounded-lg border p-6 space-y-4'>
                    <h2 className='text-lg font-semibold'>Dimensions & Specifications (Optional)</h2>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        <RHFInput
                            name='widthMm'
                            label='Width (mm)'
                            placeholder='0'
                            formatNumber
                            rules={{
                                min: { value: 0, message: 'Width must be positive' }
                            }}
                        />

                        <RHFInput
                            name='heightMm'
                            label='Height (mm)'
                            placeholder='0'
                            formatNumber
                            rules={{
                                min: { value: 0, message: 'Height must be positive' }
                            }}
                        />

                        <RHFInput
                            name='thicknessMm'
                            label='Thickness (mm)'
                            placeholder='0'
                            formatNumber
                            rules={{
                                min: { value: 0, message: 'Thickness must be positive' }
                            }}
                        />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <RHFInput
                            name='unitsPerBox'
                            label='Units Per Box'
                            placeholder='0'
                            formatNumber
                            rules={{
                                min: { value: 0, message: 'Units must be positive' }
                            }}
                        />

                        <RHFInput
                            name='areaPerUnit'
                            label='Area Per Unit (m²)'
                            placeholder='0.00'
                            formatNumber
                            rules={{
                                min: { value: 0, message: 'Area must be positive' }
                            }}
                        />
                    </div>
                </div>

                {/* Translations */}
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
                            placeholder='عنوان محصول را وارد کنید'
                            required
                        />

                        <RHFTextArea
                            name='translations.0.description'
                            label='Description (FA)'
                            placeholder='توضیحات محصول را وارد کنید'
                            rows={5}
                            required
                        />
                    </div>

                    {/* English Translation Fields */}
                    <div className={`space-y-4 ${activeTab !== 'en' ? 'hidden' : ''}`}>
                        <RHFInput
                            name='translations.1.title'
                            label='Title (EN)'
                            placeholder='Enter product title'
                            required
                        />

                        <RHFTextArea
                            name='translations.1.description'
                            label='Description (EN)'
                            placeholder='Enter product description'
                            rows={5}
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
                        {createMutation.isPending ? 'Creating...' : 'Create Product'}
                    </Button>
                </div>
            </FormProvider>
        </div>
    );
}
