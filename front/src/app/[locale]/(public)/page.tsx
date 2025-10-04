import HomeBanner from '@/components/pages/home/banner';
import HomeBlogs from '@/components/pages/home/blogs';
import HomeFeatures from '@/components/pages/home/features';
import HomeStats from '@/components/pages/home/stats';
import HomeTopProducts from '@/components/pages/home/top_products';

export default function Home() {
    return (
        <>
            <HomeBanner />

            <HomeFeatures />

            <HomeTopProducts />

            <HomeStats />

            <HomeBlogs />
        </>
    );
}
