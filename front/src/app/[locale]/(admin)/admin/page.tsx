'use client';

import { ColumnDef, Row } from '@tanstack/react-table';

import Table from '@/components/shared/table';
import { apiWithAuth } from '@/services/api';

interface User {
    id: number;
    email: string | null;
    phone: string | null;
    firstName: string | null;
    lastName: string | null;
    role: string;
    createdAt: string;
}

const columns: ColumnDef<User>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }: { row: Row<User> }) => <div className='font-medium'>{row.getValue('id')}</div>
    },
    {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }: { row: Row<User> }) => <div className='text-sm'>{row.getValue('email') || '-'}</div>
    },
    {
        accessorKey: 'phone',
        header: 'Phone',
        cell: ({ row }: { row: Row<User> }) => <div className='text-sm'>{row.getValue('phone') || '-'}</div>
    },
    {
        accessorKey: 'firstName',
        header: 'First Name',
        cell: ({ row }: { row: Row<User> }) => (
            <div className='text-sm'>{row.getValue('firstName') || '-'}</div>
        )
    },
    {
        accessorKey: 'lastName',
        header: 'Last Name',
        cell: ({ row }: { row: Row<User> }) => (
            <div className='text-sm'>{row.getValue('lastName') || '-'}</div>
        )
    },
    {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }: { row: Row<User> }) => (
            <div
                className={`px-2 py-1 w-fit rounded-full text-xs font-medium ${
                    row.getValue('role') === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                }`}>
                {row.getValue('role')}
            </div>
        )
    },
    {
        accessorKey: 'createdAt',
        header: 'Created At',
        cell: ({ row }: { row: Row<User> }) => (
            <div className='text-sm'>{new Date(row.getValue('createdAt')).toLocaleDateString()}</div>
        )
    }
];

export default function AdminPage() {
    const queryFn = async (params: { page: number; limit: number; search?: string }) => {
        const response = await apiWithAuth.get('/admin/users', {
            params: {
                page: params.page,
                limit: params.limit,
                search: params.search
            }
        });

        // Transform the response to match the expected format
        return {
            data: response.data.users,
            pagination: response.data.pagination
        };
    };

    return (
        <Table
            columns={columns}
            queryKey={['users']}
            queryFn={queryFn}
            title='Users Management'
            searchPlaceholder='Search users...'
            emptyMessage='No users found.'
            pageSize={10}
        />
    );
}
