import Sidebar from '@/components/admin/sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex p-4 gap-4 h-screen bg-primary-1'>
            <Sidebar />
            <div className='flex-1 h-full bg-background rounded p-4 shadow'>{children}</div>
        </div>
    );
}
