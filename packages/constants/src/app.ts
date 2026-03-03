/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

export const COMPANY_NAME = 'MoTown Pizza';

export const PHONES = {
  MAIN: '(254) 123 456-789',
};

export const EMAILS = {
  DEV: process.env.NEXT_PUBLIC_EMAIL_DEV,
  DELIVERY: process.env.NEXT_PUBLIC_EMAIL_DELIVERY,
  NO_REPLY: process.env.NEXT_PUBLIC_EMAIL_NOREPLY,
  INFO: process.env.NEXT_PUBLIC_EMAIL_INFO,
  SUPPORT: process.env.NEXT_PUBLIC_EMAIL_SUPPORT,
  NEWSLETTER: process.env.NEXT_PUBLIC_EMAIL_NEWSLETTER,
};

export const BUSINESS_HOURS = {
  DAYS: 'Mon - Fri',
  TIMES: '8 AM - 5 PM',
};

export const LOCATIONS = {
  MAIN: {
    LOCATION: '410 Terry Ave. North, Seattle, WA 98109',
    PIN: '#map-pin',
  },
};

export const SOCIALS = {
  X: {
    label: `X`,
    link: '#twitter',
  },
  FB: {
    label: `Facebook`,
    link: '#facebook',
  },
  IG: {
    label: `Instagram`,
    link: '#instagram',
  },
  LI: {
    label: `LinkedIn`,
    link: '#linkedin',
  },
};

export const APP_NAME = {
  ADMIN: 'MoTown Back Office',
  POS: 'MoTown POS',
  KDS: 'MoTown KDS',
  WEB: COMPANY_NAME,
};

export const APP_DESC = {
  ADMIN:
    'A lightweight and optimized Next.js template for building fast, SEO-friendly websites.',
  POS: 'A lightweight and optimized Next.js template for building fast, SEO-friendly websites.',
  KDS: 'A lightweight and optimized Next.js template for building fast, SEO-friendly websites.',
  WEB: 'A lightweight and optimized Next.js template for building fast, SEO-friendly websites.',
};
