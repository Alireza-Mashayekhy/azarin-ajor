'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { ArrowLeft, Loader2, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as yup from 'yup';

import FormProvider from '@/components/shared/form-provider';
import Logo from '@/components/shared/logo';
import RHFInput from '@/components/shared/rhf-input';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useRouter } from '@/i18n/navigation';
import { api } from '@/services/api';
import { useAuthStore } from '@/store/auth';
type PhoneFormData = {
    phoneNumber: string;
};

type OtpFormData = {
    otp: string;
};

export default function LoginPage() {
    const t = useTranslations('login');
    const { login } = useAuthStore();
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [resendCooldown, setResendCooldown] = useState(0);
    const router = useRouter();

    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => {
                setResendCooldown(resendCooldown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const phoneSchema = yup.object({
        phoneNumber: yup
            .string()
            .required(t('validation.phoneRequired'))
            .matches(/^09\d{9}$/, t('validation.phoneInvalid'))
    });

    const otpSchema = yup.object({
        otp: yup.string().required(t('validation.otpRequired')).length(5, t('validation.otpLength'))
    });

    const phoneMethods = useForm<PhoneFormData>({
        resolver: yupResolver(phoneSchema),
        defaultValues: {
            phoneNumber: ''
        }
    });

    const otpMethods = useForm<OtpFormData>({
        resolver: yupResolver(otpSchema),
        defaultValues: {
            otp: ''
        }
    });

    const sendOtpMutation = useMutation({
        mutationFn: async (phoneNumber: string) => {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            return { success: true };
        },
        onSuccess: () => {
            toast.success(t('otpSent'));
        },
        onError: () => {
            toast.error(t('otpSendError'));
        }
    });

    const onPhoneSubmit = async (data: PhoneFormData) => {
        sendOtpMutation.mutate(data.phoneNumber, {
            onSuccess: () => {
                setPhoneNumber(data.phoneNumber);
                setStep('otp');
                setResendCooldown(120); // 2 minutes = 120 seconds
            }
        });
    };

    // Verify OTP mutation
    const verifyOtpMutation = useMutation({
        mutationFn: async (data: { phoneNumber: string; otp: string }) => {
            const response = await api.post('/auth/otp', {
                phone: data.phoneNumber,
                code: data.otp
            });
            return response.data;
        },
        onSuccess: (data) => {
            const { token, user } = data;

            Cookies.set('token', token, { expires: 30 });
            Cookies.set('role', user.role, { expires: 30 });

            login(user, token);

            toast.success(t('loginSuccess'));

            user.role === 'ADMIN' ? router.push('/admin') : router.push('/panel');
        },
        onError: (error: any) => {
            console.error('Error verifying OTP:', error);

            if (error.response?.status === 403) {
                const errorMessage = t('otpVerifyError');
                toast.error(errorMessage);
            } else {
                const errorMessage = error.response?.data?.message || t('otpVerifyError');
                toast.error(errorMessage);
            }
        }
    });

    const onOtpSubmit = useCallback(
        (data: OtpFormData) => {
            verifyOtpMutation.mutate({
                phoneNumber,
                otp: data.otp
            });
        },
        [phoneNumber, verifyOtpMutation]
    );

    useEffect(() => {
        if (step === 'otp') {
            const subscription = otpMethods.watch((value) => {
                if (value.otp && value.otp.length === 5) {
                    onOtpSubmit({ otp: value.otp });
                }
            });
            return () => subscription.unsubscribe();
        }
    }, [step, otpMethods, onOtpSubmit]);

    const handleBackToPhone = () => {
        setStep('phone');
        otpMethods.reset();
    };

    const resendOtpMutation = useMutation({
        mutationFn: async (phoneNumber: string) => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return { success: true };
        },
        onSuccess: () => {
            setResendCooldown(120); // 2 minutes = 120 seconds
            toast.success(t('otpResent'));
        },
        onError: () => {
            toast.error(t('otpResendError'));
        }
    });

    const handleResendOtp = () => {
        if (resendCooldown > 0) return;
        resendOtpMutation.mutate(phoneNumber);
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-primary-1 to-primary-2 flex items-center justify-center p-4'>
            <div className='w-full max-w-md'>
                <div className='flex justify-center'>
                    <Logo />
                </div>

                <div className='bg-white rounded-2xl shadow-xl border border-gray-200 p-8'>
                    <div className='text-center mb-8'>
                        <h1 className='text-2xl font-bold text-gray-900 mb-2'>
                            {step === 'phone' ? t('title') : t('otpTitle')}
                        </h1>
                        <p className='text-gray-600 text-sm'>
                            {step === 'phone' ? t('phoneSubtitle') : t('otpSubtitle', { phoneNumber })}
                        </p>
                    </div>

                    {step === 'phone' && (
                        <FormProvider
                            methods={phoneMethods}
                            onSubmit={phoneMethods.handleSubmit(onPhoneSubmit)}>
                            <div className='space-y-6'>
                                <RHFInput
                                    name='phoneNumber'
                                    label={t('phoneLabel')}
                                    placeholder={t('phonePlaceholder')}
                                    type='tel'
                                    required
                                    className='text-center '
                                    maxLength={11}
                                />

                                <Button type='submit' className='w-full' disabled={sendOtpMutation.isPending}>
                                    {sendOtpMutation.isPending ? (
                                        <>
                                            <Loader2 className='w-5 h-5 animate-spin' />
                                            {t('sending')}
                                        </>
                                    ) : (
                                        <>
                                            <Phone className='w-5 h-5' />
                                            {t('sendCode')}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </FormProvider>
                    )}

                    {step === 'otp' && (
                        <FormProvider methods={otpMethods} onSubmit={otpMethods.handleSubmit(onOtpSubmit)}>
                            <div className='space-y-6'>
                                <div className='flex justify-center' dir='ltr' style={{ direction: 'ltr' }}>
                                    <InputOTP
                                        maxLength={5}
                                        {...otpMethods.register('otp')}
                                        onChange={(value) => otpMethods.setValue('otp', value)}>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>

                                <div className='space-y-4'>
                                    <Button
                                        type='submit'
                                        className='w-full'
                                        disabled={
                                            verifyOtpMutation.isPending ||
                                            otpMethods.watch('otp')?.length !== 5
                                        }>
                                        {verifyOtpMutation.isPending ? (
                                            <>
                                                <Loader2 className='w-5 h-5 animate-spin' />
                                                {t('verifying')}
                                            </>
                                        ) : (
                                            t('verifyAndLogin')
                                        )}
                                    </Button>

                                    <div className='flex flex-col gap-3'>
                                        <Button
                                            type='button'
                                            variant='outline'
                                            onClick={handleResendOtp}
                                            disabled={resendOtpMutation.isPending || resendCooldown > 0}
                                            className='w-full'>
                                            {resendCooldown > 0
                                                ? `${t('resendCode')} (${Math.floor(resendCooldown / 60)}:${(
                                                      resendCooldown % 60
                                                  )
                                                      .toString()
                                                      .padStart(2, '0')})`
                                                : t('resendCode')}
                                        </Button>

                                        <Button
                                            type='button'
                                            variant='ghost'
                                            onClick={handleBackToPhone}
                                            disabled={
                                                verifyOtpMutation.isPending || resendOtpMutation.isPending
                                            }
                                            className='w-full text-gray-600 '>
                                            <ArrowLeft className='w-4 h-4' />
                                            {t('changePhone')}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </FormProvider>
                    )}
                </div>

                <div className='text-center mt-6'>
                    <p className='text-xs text-gray-500 '>{t('terms')}</p>
                </div>
            </div>
        </div>
    );
}
