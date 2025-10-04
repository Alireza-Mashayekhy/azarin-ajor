'use client';

import { useQuery } from '@tanstack/react-query';
import {
    Cell,
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    HeaderGroup,
    Row,
    SortingState,
    useReactTable
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TableProps<T> {
    columns: ColumnDef<T>[];
    queryKey: string[];
    queryFn: (params: { page: number; limit: number; search?: string }) => Promise<{
        data: T[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    title?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    pageSize?: number;
}

export default function Table<T>({
    columns,
    queryKey,
    queryFn,
    title,
    searchPlaceholder = 'Search...',
    emptyMessage = 'No data found.',
    pageSize = 10
}: TableProps<T>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [debouncedFilter, setDebouncedFilter] = useState('');
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize
    });

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedFilter(globalFilter);
        }, 1000);

        return () => clearTimeout(timer);
    }, [globalFilter]);

    const { data, isLoading, error } = useQuery({
        queryKey: [...queryKey, pagination.pageIndex + 1, pagination.pageSize, debouncedFilter],
        queryFn: () =>
            queryFn({
                page: pagination.pageIndex + 1,
                limit: pagination.pageSize,
                search: debouncedFilter || undefined
            })
    });

    const table = useReactTable({
        data: isLoading ? [] : data?.data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        state: {
            sorting,
            columnFilters,
            globalFilter,
            pagination
        },
        manualPagination: true,
        pageCount: data?.pagination.totalPages || -1
    });

    if (isLoading) {
        return (
            <div className='space-y-4'>
                {(title || searchPlaceholder) && (
                    <div className='flex items-center justify-between'>
                        {title && <h1 className='text-2xl font-bold'>{title}</h1>}
                        <div className='flex items-center space-x-2'>
                            <div className='h-10 w-64 bg-gray-200 rounded-md animate-pulse' />
                        </div>
                    </div>
                )}

                <div className='rounded-md border'>
                    <table className='w-full'>
                        <thead>
                            <tr className='border-b'>
                                {columns.map((_, index) => (
                                    <th
                                        key={index}
                                        className='px-4 py-3 text-start font-medium text-gray-900'>
                                        <div className='h-4 w-20 bg-gray-200 rounded animate-pulse' />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: pageSize }).map((_, rowIndex) => (
                                <tr key={rowIndex} className='border-b'>
                                    {columns.map((_, cellIndex) => (
                                        <td key={cellIndex} className='px-4 py-3 text-start'>
                                            <div className='h-4 w-16 bg-gray-200 rounded animate-pulse' />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className='flex items-center justify-between'>
                    <div className='h-4 w-32 bg-gray-200 rounded animate-pulse' />
                    <div className='flex items-center space-x-2'>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className='h-8 w-8 bg-gray-200 rounded animate-pulse' />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex items-center justify-center h-64'>
                <div className='text-lg text-red-600'>Error loading data</div>
            </div>
        );
    }

    return (
        <div className='space-y-4'>
            {(title || searchPlaceholder) && (
                <div className='flex items-center justify-between'>
                    {title && <h1 className='text-2xl font-bold'>{title}</h1>}
                    <div className='flex items-center space-x-2'>
                        <Input
                            placeholder={searchPlaceholder}
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className='max-w-sm'
                        />
                    </div>
                </div>
            )}

            <div className='rounded-md border overflow-x-auto w-full max-w-[calc(100vw-130px)]'>
                <table className='w-full'>
                    <thead>
                        {table.getHeaderGroups().map((headerGroup: HeaderGroup<T>) => (
                            <tr key={headerGroup.id} className='border-b'>
                                {headerGroup.headers.map((header: any) => (
                                    <th
                                        key={header.id}
                                        className='px-4 py-3 text-start font-medium text-gray-900 whitespace-nowrap'>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row: Row<T>) => (
                                <tr key={row.id} className='border-b hover:bg-gray-50'>
                                    {row.getVisibleCells().map((cell: Cell<T, unknown>) => (
                                        <td key={cell.id} className='px-4 py-3 text-start'>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className='h-24 text-center'>
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className='flex items-center justify-between'>
                <div className='text-sm text-gray-700'>Showing {data?.pagination.total || 0} items</div>
                <div className='flex items-center space-x-2'>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}>
                        <ChevronsLeft className='h-4 w-4 rtl:rotate-180' />
                    </Button>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}>
                        <ChevronLeft className='h-4 w-4 rtl:rotate-180' />
                    </Button>
                    <div className='flex items-center space-x-1'>
                        <span className='text-sm'>
                            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                        </span>
                    </div>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}>
                        <ChevronRight className='h-4 w-4 rtl:rotate-180' />
                    </Button>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}>
                        <ChevronsRight className='h-4 w-4 rtl:rotate-180' />
                    </Button>
                </div>
            </div>
        </div>
    );
}
