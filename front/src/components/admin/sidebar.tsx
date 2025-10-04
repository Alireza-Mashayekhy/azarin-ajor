import { FileText, MessageCircle, MessageSquare, Package, ShoppingCart, Tag, User } from 'lucide-react';

import { Link } from '@/i18n/navigation';

import { Button } from '../ui/button';

const sidebarItems = [
    {
        icon: User,
        href: '/admin',
        label: 'Users'
    },
    {
        icon: Package,
        href: '/admin/products',
        label: 'Products'
    },
    {
        icon: FileText,
        href: '/admin/blogs',
        label: 'Blogs'
    },
    {
        icon: Tag,
        href: '/admin/categories',
        label: 'Categories'
    },
    {
        icon: MessageSquare,
        href: '/admin/tickets',
        label: 'Tickets'
    },
    {
        icon: ShoppingCart,
        href: '/admin/orders',
        label: 'Orders'
    },
    {
        icon: MessageCircle,
        href: '/admin/comments',
        label: 'Comments'
    }
];

export default function Sidebar() {
    return (
        <div className='flex flex-col gap-2 p-2 bg-background shadow rounded'>
            {sidebarItems.map((item) => (
                <Link href={item.href} key={item.href}>
                    <Button variant='ghost' size='icon'>
                        <item.icon className='size-5' />
                        {/* <span>{item.label}</span> */}
                    </Button>
                </Link>
            ))}
        </div>
    );
}
