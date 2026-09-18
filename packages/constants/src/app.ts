export const COMPANY_NAME = 'MoTown Pizza';

export const PHONES = {
  PHONES: '0707 000 014/15/16',
  PHONE1: '0707 000 014',
  PHONE2: '0707 000 015',
  PHONE3: '0707 000 016',
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
    link: 'https://x.com/motownpizza_ke',
  },
  // FB: {
  //   label: `Facebook`,
  //   link: '#facebook',
  // },
  IG: {
    label: `Instagram`,
    link: 'https://www.instagram.com/motownpizza_ke',
  },
  // LI: {
  //   label: `LinkedIn`,
  //   link: '#linkedin',
  // },
  TI: {
    label: `TikTok`,
    link: 'https://www.tiktok.com/@motownpizza_ke',
  },
  YT: {
    label: `YouTube`,
    link: 'https://www.youtube.com/@motownpizza_ke',
  },
};

export const APP_NAME = {
  API: `${COMPANY_NAME} Server`,
  ADMIN: `${COMPANY_NAME} Admin`,
  WEB: COMPANY_NAME,
  POS: `${COMPANY_NAME} POS`,
  KDS: `${COMPANY_NAME} KDS`,
};

export const APP_DESC = {
  API: 'A high-performance backend API engine delivering secure, real-time data synchronization and endpoints across all pizza operations.',
  ADMIN:
    'A comprehensive back-office management dashboard for real-time inventory control, staff scheduling, business reporting, and store configuration.',
  WEB: 'A lightning-fast, SEO-optimized customer-facing pizza ordering website designed for seamless menu browsing, mobile checkout, and marketing.',
  POS: 'A reliable, high-speed Point of Sale system built for rapid order entry, secure payment processing, and smooth in-store operations.',
  KDS: 'An intelligent Kitchen Display System for real-time order tracking, ticket management, and optimized kitchen workflow automation.',
};
