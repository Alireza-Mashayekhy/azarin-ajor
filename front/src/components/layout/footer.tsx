'use client';

import { Facebook, Instagram, Mail, MapPin, Phone, Twitter, Youtube } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import Logo from '../shared/logo';

export const Footer = () => {
    const t = useTranslations('Footer');

    const currentYear = new Date().getFullYear();

    const socialLinks = [
        {
            name: 'Instagram',
            href: '#',
            icon: Instagram,
            color: 'hover:text-pink-500'
        },
        {
            name: 'Facebook',
            href: '#',
            icon: Facebook,
            color: 'hover:text-blue-600'
        },
        {
            name: 'Twitter',
            href: '#',
            icon: Twitter,
            color: 'hover:text-blue-400'
        },
        {
            name: 'YouTube',
            href: '#',
            icon: Youtube,
            color: 'hover:text-red-600'
        }
    ];

    const quickLinks = [
        { href: '/', label: t('home') },
        { href: '/products', label: t('products') },
        { href: '/about', label: t('about') },
        { href: '/contact', label: t('contact') },
        { href: '/blog', label: t('blog') }
    ];

    const supportLinks = [
        { href: '/faq', label: t('faq') },
        { href: '/shipping', label: t('shipping') },
        { href: '/returns', label: t('returns') },
        { href: '/privacy', label: t('privacy') },
        { href: '/terms', label: t('terms') }
    ];

    const contactInfo = [
        {
            icon: Phone,
            text: '+98 21 1234 5678',
            href: 'tel:+982112345678'
        },
        {
            icon: Mail,
            text: 'info@azarinajor.com',
            href: 'mailto:info@azarinajor.com'
        },
        {
            icon: MapPin,
            text: t('address'),
            href: '#'
        }
    ];

    return (
        <footer className='bg-gradient-to-br from-primary-5 to-primary-6 text-white'>
            {/* Main Footer Content */}
            <div className='custom-container py-16'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12'>
                    {/* Company Info */}
                    <div className='lg:col-span-1 space-y-6'>
                        <div>
                            <div className='bg-background w-fit px-2 h-fit rounded'>
                                <Logo />
                            </div>
                        </div>
                        <p className='text-white/80 font-auto leading-relaxed text-sm'>{t('description')}</p>

                        {/* Social Links */}
                        <div className='flex gap-2'>
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <Link
                                        key={social.name}
                                        href={social.href}
                                        className={`p-2 bg-white/10 rounded-full transition-all duration-300 hover:bg-white/20 ${social.color} hover:scale-110`}
                                        aria-label={social.name}>
                                        <Icon className='w-5 h-5' />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className='space-y-6'>
                        <h3 className='text-lg font-semibold font-auto'>{t('quickLinks')}</h3>
                        <ul className='space-y-3'>
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className='text-white/80 hover:text-white transition-colors duration-300 font-auto text-sm hover:translate-x-1 rtl:hover:-translate-x-1 inline-block'>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div className='space-y-6'>
                        <h3 className='text-lg font-semibold font-auto'>{t('support')}</h3>
                        <ul className='space-y-3'>
                            {supportLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className='text-white/80 hover:text-white transition-colors duration-300 font-auto text-sm hover:translate-x-1 rtl:hover:-translate-x-1 inline-block'>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className='space-y-6'>
                        <h3 className='text-lg font-semibold font-auto'>{t('contact')}</h3>
                        <ul className='space-y-4'>
                            {contactInfo.map((contact, index) => {
                                const Icon = contact.icon;
                                return (
                                    <li key={index} className='flex items-start gap-2'>
                                        <Icon className='w-5 h-5 text-primary-4 flex-shrink-0' />
                                        <Link
                                            href={contact.href}
                                            className='text-white/80 hover:text-white transition-colors duration-300 font-auto text-sm'>
                                            {contact.text}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className='border-t border-white/10'>
                <div className='custom-container py-6'>
                    <div className='flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0'>
                        <p className='text-white/60 font-auto text-sm text-center md:text-right rtl:md:text-left'>
                            © {currentYear} {t('companyName')}. {t('allRightsReserved')}
                        </p>
                        <div className='flex items-center gap-4'>
                            <Link
                                href='/privacy'
                                className='text-white/60 hover:text-white transition-colors duration-300 font-auto text-sm'>
                                {t('privacy')}
                            </Link>
                            <Link
                                href='/terms'
                                className='text-white/60 hover:text-white transition-colors duration-300 font-auto text-sm'>
                                {t('terms')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
