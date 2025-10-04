'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from '@/components/ui/pagination';

interface CustomPaginationProps {
    totalPages: number;
    currentPage?: number;
    siblingsCount?: number;
    scrollOffset?: number;
    scrollId?: string;
}

export default function CustomPagination({
    totalPages,
    currentPage = 1,
    siblingsCount = 1,
    scrollOffset = 100,
    scrollId = 'items-list'
}: CustomPaginationProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const urlKey = 'page';
    const pageFromUrl = (() => {
        const p = searchParams.get(urlKey);
        const n = p ? parseInt(p, 10) : NaN;
        return Number.isNaN(n) ? undefined : Math.max(1, n);
    })();
    const activePage = pageFromUrl ?? currentPage;

    const handleScroll = () => {
        const postersList = document.getElementById(scrollId);
        if (postersList) {
            const offset = scrollOffset; // offset in pixels
            const elementPosition = postersList.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const prevPage = Math.max(1, activePage - 1);
    const nextPage = Math.min(totalPages, activePage + 1);

    const createQueryString = useCallback(
        (page: number) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set('page', page.toString());
            return params.toString();
        },
        [searchParams]
    );

    const goToPage = (page: number) => {
        router.push(`${pathname}?${createQueryString(page)}`);
        handleScroll();
    };

    const generatePaginationItems = () => {
        const items = [];

        items.push(
            <PaginationItem key='1'>
                <PaginationLink
                    href={`${pathname}?${createQueryString(1)}`}
                    isActive={activePage === 1}
                    scroll={false}
                    onClick={(e) => {
                        e.preventDefault();
                        goToPage(1);
                    }}>
                    1
                </PaginationLink>
            </PaginationItem>
        );

        if (activePage > siblingsCount + 2) {
            items.push(
                <PaginationItem key='ellipsis-1'>
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }

        for (
            let i = Math.max(2, activePage - siblingsCount);
            i <= Math.min(totalPages - 1, activePage + siblingsCount);
            i++
        ) {
            if (i === 1 || i === totalPages) continue;

            items.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        href={`${pathname}?${createQueryString(i)}`}
                        isActive={activePage === i}
                        scroll={false}
                        onClick={(e) => {
                            e.preventDefault();
                            goToPage(i);
                        }}>
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        if (activePage < totalPages - siblingsCount - 1 && totalPages > 2) {
            items.push(
                <PaginationItem key='ellipsis-2'>
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }

        if (totalPages > 1) {
            items.push(
                <PaginationItem key={totalPages}>
                    <PaginationLink
                        href={`${pathname}?${createQueryString(totalPages)}`}
                        isActive={activePage === totalPages}
                        scroll={false}
                        onClick={(e) => {
                            e.preventDefault();
                            goToPage(totalPages);
                        }}>
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return items;
    };

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        textClassName='!hidden'
                        scroll={false}
                        href={currentPage > 1 ? `${pathname}?${createQueryString(prevPage)}` : '#'}
                        onClick={(e) => {
                            if (currentPage <= 1) return;
                            e.preventDefault();
                            router.push(`${pathname}?${createQueryString(prevPage)}`);
                            handleScroll();
                        }}
                        className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                </PaginationItem>

                {generatePaginationItems()}

                <PaginationItem>
                    <PaginationNext
                        textClassName='!hidden'
                        scroll={false}
                        href={currentPage < totalPages ? `${pathname}?${createQueryString(nextPage)}` : '#'}
                        onClick={(e) => {
                            if (currentPage >= totalPages) return;
                            e.preventDefault();
                            router.push(`${pathname}?${createQueryString(nextPage)}`);
                            handleScroll();
                        }}
                        className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
