import Image from 'next/image';
import Link from 'next/link';

import { Product_type } from '@/types/product';

export default function ProductCard({ product }: { product: Product_type }) {
    return (
        <Link href={`/products/${product.slug}`} className='block'>
            <div className='group rounded-xl shadow overflow-hidden w-full aspect-square relative cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105'>
                <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className='object-cover transition-transform duration-300 group-hover:scale-110'
                />

                {/* Hover overlay with product info */}
                <div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4'>
                    <div className='transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300'>
                        <h3 className='text-white font-semibold text-lg mb-2 line-clamp-2'>
                            {product.title}
                        </h3>
                        <p className='text-white/90 text-sm font-medium'>
                            {product.price.toLocaleString('fa-IR')} تومان
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}
