'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef, Row } from '@tanstack/react-table';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import Table from '@/components/shared/table';
import { Button } from '@/components/ui/button';
import { apiWithAuth } from '@/services/api';
import { Product } from '@/types/product';

export default function ProductsPage() {
    const queryClient = useQueryClient();
    const router = useRouter();

    const queryFn = async (params: { page: number; limit: number; search?: string }) => {
        const response = await apiWithAuth.get('/admin/products', {
            params: {
                page: params.page,
                limit: params.limit,
                search: params.search
            }
        });

        return {
            data: response.data.products,
            pagination: response.data.pagination
        };
    };

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await apiWithAuth.delete(`/admin/products/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Product deleted successfully');
        },
        onError: (error: any) => {
            console.error('Error deleting product:', error);
            toast.error('Failed to delete product');
        }
    });

    const handleEdit = (id: number) => {
        // TODO: Implement edit functionality
        console.log('Edit product:', id);
        toast.info('Edit functionality coming soon');
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteMutation.mutate(id);
        }
    };

    const handleCreate = () => {
        router.push('/admin/products/new');
    };

    const columns: ColumnDef<Product>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            cell: ({ row }: { row: Row<Product> }) => <div className='font-medium'>{row.getValue('id')}</div>
        },
        {
            accessorKey: 'slug',
            header: 'Slug',
            cell: ({ row }: { row: Row<Product> }) => <div className='text-sm'>{row.getValue('slug')}</div>
        },
        {
            accessorKey: 'translations',
            header: 'Title',
            cell: ({ row }: { row: Row<Product> }) => {
                const translations = row.getValue('translations') as Product['translations'];
                const faTranslation = translations.find((t) => t.locale === 'fa');
                const enTranslation = translations.find((t) => t.locale === 'en');
                return (
                    <div className='text-sm'>
                        <div className='font-medium'>
                            {faTranslation?.title || enTranslation?.title || '-'}
                        </div>
                        {enTranslation?.title &&
                            faTranslation?.title &&
                            enTranslation.title !== faTranslation.title && (
                                <div className='text-xs text-gray-500'>{enTranslation.title}</div>
                            )}
                    </div>
                );
            }
        },
        {
            accessorKey: 'price',
            header: 'Price',
            cell: ({ row }: { row: Row<Product> }) => {
                const price = row.getValue('price') as number;
                return <div className='text-sm font-medium'>{price.toLocaleString()} تومان</div>;
            }
        },
        {
            accessorKey: 'size',
            header: 'Size',
            cell: ({ row }: { row: Row<Product> }) => {
                const size = row.getValue('size') as string;
                return <div className='text-sm'>{size || '-'}</div>;
            }
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }: { row: Row<Product> }) => {
                const product = row.original;

                return (
                    <div className='flex items-center space-x-2'>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={() => handleEdit(product.id)}
                            className='h-8 w-8 p-0'>
                            <Edit className='h-4 w-4' />
                        </Button>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={() => handleDelete(product.id)}
                            className='h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50'>
                            <Trash2 className='h-4 w-4' />
                        </Button>
                    </div>
                );
            }
        }
    ];

    return (
        <div className='space-y-4'>
            <div className='flex items-center justify-between'>
                <h1 className='text-2xl font-bold'>Products Management</h1>
                <Button onClick={handleCreate} className='flex items-center space-x-2'>
                    <Plus className='h-4 w-4' />
                    <span>Create Product</span>
                </Button>
            </div>

            <Table
                columns={columns}
                queryKey={['products']}
                queryFn={queryFn}
                searchPlaceholder='Search products...'
                emptyMessage='No products found.'
                pageSize={10}
            />
        </div>
    );
}
