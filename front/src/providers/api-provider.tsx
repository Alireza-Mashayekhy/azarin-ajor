'use client';

import { useLocale } from 'next-intl';
import React from 'react';

import { api, apiWithAuth } from '@/services/api';

const ApiProvider = ({ children }: { children: React.ReactNode }) => {
    const currentLocale = useLocale();

    api.interceptors.request.use((config) => {
        config.params = { ...config.params, lang: currentLocale };
        return config;
    });
    apiWithAuth.interceptors.request.use((config) => {
        config.params = { ...config.params, lang: currentLocale };
        return config;
    });

    return <>{children}</>;
};

export default ApiProvider;
