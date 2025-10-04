import { cookies } from 'next/headers';
import { getLocale } from 'next-intl/server';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
const baseURLV2 = process.env.NEXT_PUBLIC_SSR_URL_V2;

interface Settings {
    sendToken?: boolean;
    v2?: boolean;
}

export async function fetcher(url: string, options?: RequestInit, settings?: Settings): Promise<Response> {
    try {
        const locale = await getLocale();

        const separator = url.includes('?') ? '&' : '?';
        const localizedUrl = `${url}${separator}lang=${locale}&language=${locale}`;

        const cookieStore = await cookies();
        const token = cookieStore.get('token');

        const res = await fetch(`${settings?.v2 ? baseURLV2 : baseURL}${localizedUrl}`, {
            headers: {
                'Content-Type': 'application/json',
                ...(settings?.sendToken &&
                    token?.value && {
                        Authorization: `Bearer ${token.value}`
                    })
            },
            ...options
        });

        if (!res.ok) {
            const errorBody = await res.text();
            throw new Error(
                `Request failed with status ${res.status}: ${res.statusText}\nBody: ${errorBody}`
            );
        }

        return res;
    } catch (error: any) {
        console.error('Fetcher error:', error);

        // برای لاگ دقیق‌تر
        if (error.code === 'UND_ERR_CONNECT_TIMEOUT') {
            throw new Error(`Fetcher timeout: could not connect to API within the expected time.`);
        }

        throw new Error(`Fetcher failed: ${error.message}`);
    }
}
