// this instance is used for all client side api calls

import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

// Simple logout function that doesn't use React hooks
const handleLogout = () => {
    Cookies.remove('token');
    // Redirect to login page
    if (typeof window !== 'undefined') {
        window.location.href = '/login';
    }
};

// this instance for public endpoints
export const api = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// this instance for endpoints that need the user token
export const apiWithAuth = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});
// Request interceptor to dynamically add token
const addAuthHeader = (config: any) => {
    const token = Cookies.get('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};

// Interceptor برای مدیریت خطاها
const handleApiError = (error: any) => {
    if (error.response) {
        const { status, data } = error.response;

        switch (status) {
            case 401:
                handleLogout();
                toast.error('please login');
                break;
        }
    }

    return Promise.reject(error);
};

// اضافه کردن request interceptor برای اضافه کردن توکن
apiWithAuth.interceptors.request.use(addAuthHeader);

// اضافه کردن response interceptor برای مدیریت خطاها
api.interceptors.response.use((response) => response, handleApiError);
apiWithAuth.interceptors.response.use((response) => response, handleApiError);
