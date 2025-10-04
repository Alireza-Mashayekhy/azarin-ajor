'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef, Row } from '@tanstack/react-table';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import AddCategoryDialog from '@/components/admin/categories/add-category';
import Table from '@/components/shared/table';
import { Button } from '@/components/ui/button';
import { apiWithAuth } from '@/services/api';
import { Category } from '@/types/category';

export default function CategoriesPage() {
    const queryClient = useQueryClient();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const queryFn = async (params: { page: number; limit: number; search?: string }) => {
        const response = await apiWithAuth.get('/admin/category', {
            params: {
                page: params.page,
                limit: params.limit,
                search: params.search
            }
        });

        return {
            data: response.data.categories,
            pagination: response.data.pagination
        };
    };

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await apiWithAuth.delete(`/admin/category/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Category deleted successfully');
        },
        onError: (error: any) => {
            console.error('Error deleting category:', error);
            toast.error('Failed to delete category');
        }
    });

    const handleEdit = (id: number) => {
        // TODO: Implement edit functionality
        console.log('Edit category:', id);
        toast.info('Edit functionality coming soon');
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            deleteMutation.mutate(id);
        }
    };

    const handleCreate = () => {
        setIsAddDialogOpen(true);
    };

    const columns: ColumnDef<Category>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            cell: ({ row }: { row: Row<Category> }) => <div className='font-medium'>{row.getValue('id')}</div>
        },
        {
            accessorKey: 'slug',
            header: 'Slug',
            cell: ({ row }: { row: Row<Category> }) => <div className='text-sm'>{row.getValue('slug')}</div>
        },
        {
            accessorKey: 'translations',
            header: 'Title',
            cell: ({ row }: { row: Row<Category> }) => {
                const translations = row.getValue('translations') as Category['translations'];
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
            accessorKey: '_count',
            header: 'Posts',
            cell: ({ row }: { row: Row<Category> }) => {
                const count = row.getValue('_count') as Category['_count'];
                return <div className='text-sm'>{count.posts}</div>;
            }
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }: { row: Row<Category> }) => {
                const category = row.original;

                return (
                    <div className='flex items-center space-x-2'>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={() => handleEdit(category.id)}
                            className='h-8 w-8 p-0'>
                            <Edit className='h-4 w-4' />
                        </Button>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={() => handleDelete(category.id)}
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
                <h1 className='text-2xl font-bold'>Categories Management</h1>
                <Button onClick={handleCreate} className='flex items-center space-x-2'>
                    <Plus className='h-4 w-4' />
                    <span>Create Category</span>
                </Button>
            </div>

            <Table
                columns={columns}
                queryKey={['categories']}
                queryFn={queryFn}
                searchPlaceholder='Search categories...'
                emptyMessage='No categories found.'
                pageSize={10}
            />

            <AddCategoryDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
        </div>
    );
}
