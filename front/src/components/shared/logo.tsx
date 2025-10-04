import Image from 'next/image';

import { Link } from '@/i18n/navigation';

export default function Logo() {
    return (
        <div className='relative h-12 sm:h-16 aspect-video'>
            <Link href='/' className='w-fit'>
                <Image src='/logo.png' alt='Logo' loading='eager' fill className='object-contain' priority />
            </Link>
        </div>
    );
}
